import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import getAvailableEvents from '@salesforce/apex/EventRegistrationController.getAvailableEvents';
import createCheckoutSession from '@salesforce/apex/StripePaymentService.createCheckoutSession';

export default class EventRegistrationForm extends LightningElement {
    @track isLoading = true;
    @track isProcessingPayment = false;
    @track allEvents = [];
    @track eventOptions = [];
    @track selectedEventId = null;
    @track selectedEventPrice = 0;
    @track ticketQuantity = 1;
    @track selectedEventIdFromUrl = false;

    currencyCode = 'inr';

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        if (currentPageReference) {
            const eventIdFromUrl = currentPageReference.state?.eventId;
            if (eventIdFromUrl) {
                this.selectedEventId = eventIdFromUrl;
                this.selectedEventIdFromUrl = true;
            }
        }
    }

    @wire(getAvailableEvents)
    wiredEvents({ error, data }) {
        this.isLoading = true;
        if (data) {
            this.allEvents = data;
            this.eventOptions = data.map(event => ({
                label: `${event.Name} (${(event.Ticket_Price__c || 0)
                    .toLocaleString('en-US', { style: 'currency', currency: 'INR' })})`,
                value: event.Id
            }));

            const preselected = this.selectedEventId || (this.eventOptions.length > 0 ? this.eventOptions[0].value : null);
            this.selectedEventId = preselected;
            this.updateEventDetails(preselected);
            this.isLoading = false;
        } else if (error) {
            this.showToast('Error', 'Failed to load events: ' + error.body.message, 'error');
            this.isLoading = false;
        }
    }

    get totalAmount() {
        return this.selectedEventPrice * this.ticketQuantity;
    }

    get paymentButtonLabel() {
        return this.isProcessingPayment ? 'Redirecting to Payment...' :
               `Pay ${this.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}`;
    }

    get isPaymentDisabled() {
        return this.isProcessingPayment || !this.selectedEventId || this.totalAmount <= 0;
    }

    get siteBaseUrl() {
        const fullPath = window.location.href;
        const sitePathIndex = fullPath.indexOf('/s/') > -1 ? fullPath.indexOf('/s/') : fullPath.length;
        return sitePathIndex > -1 ? fullPath.substring(0, sitePathIndex + 2) : window.location.origin;
    }

    handleEventChange(event) {
        this.selectedEventId = event.detail.value;
        this.updateEventDetails(this.selectedEventId);
    }

    handleQuantityChange(event) {
        this.ticketQuantity = Math.max(1, parseInt(event.detail.value || 1, 10));
    }

    updateEventDetails(eventId) {
        const event = this.allEvents.find(e => e.Id === eventId);
        this.selectedEventPrice = event ? event.Ticket_Price__c || 0 : 0;
    }

    async handlePayment() {
        if (!this.selectedEventId || this.totalAmount <= 0) {
            this.showToast('Error', 'Please select a valid event and ticket quantity.', 'error');
            return;
        }

        this.isProcessingPayment = true;

        try {
            const checkoutUrl = await createCheckoutSession({
                eventId: this.selectedEventId,
                quantity: this.ticketQuantity,
                totalAmount: this.totalAmount,
                siteBaseUrl: this.siteBaseUrl,
                currencyCode: this.currencyCode
            });

            if (checkoutUrl && checkoutUrl.startsWith('http')) {
                window.location.href = checkoutUrl;
            } else {
                this.showToast('Error', 'Failed to generate Stripe payment link.', 'error');
            }
        } catch (error) {
            console.error('Checkout Error:', JSON.stringify(error));
            this.showToast('Error', 'Unable to start payment.', 'error');
        } finally {
            this.isProcessingPayment = false;
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}