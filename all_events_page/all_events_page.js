import { LightningElement, wire } from 'lwc';
import getEvents from '@salesforce/apex/EventDataProvider.getEvents';

export default class All_events_page extends LightningElement {
    // Stores the raw event records fetched from Apex
    wiredEventRecords = [];
    error;

    // Use the @wire service to call the getEvents Apex method
    @wire(getEvents)
    wiredEvents({ error, data }) {
        if (data) {
            // Success: Map raw data into a structure suitable for the template
            this.wiredEventRecords = data.map(event => ({
                Id: event.Id,
                Name: event.Name,
                // Use the Image_Url__c field for the card image source
                ImageSrc: event.Image_Url__c,
                // Format the dates for display on the card
                StartDateFormatted: formatDate(event.Start_Date__c),
                EndDateFormatted: formatDate(event.End_Date__c),
                // Example for optional text below the name
                LocationText: 'Venue To Be Announced', // Placeholder
                PriceText: 'Price 2000 onwards' // Placeholder
            }));
            this.error = undefined;
        } else if (error) {
            // Handle any errors during Apex call (e.g., FLS/Sharing issues)
            this.error = error;
            this.wiredEventRecords = [];
            console.error('Error fetching events:', error);
        }
    }

    get hasEvents() {
        return this.wiredEventRecords && this.wiredEventRecords.length > 0;
    }

    // Placeholder function for handling image loading errors
    handleImageError(event) {
        event.target.onerror = null;
        // Fallback to a clean placeholder image if the image URL fails
        event.target.src = 'https://placehold.co/300x450/E5E7EB/000?text=No+Image';
    }

    // NOTE: You would need to implement a detailed navigation mixin if you want 
    // the card clicks to link to the event record page.
}

/** * Mock Utility Function (Place this logic in your LWC component or a separate utility file)
 * If you're using Experience Cloud, use client-side Date methods.
 * This is a minimal implementation to prevent errors.
 */
function formatDate(dateValue) {
    if (!dateValue) return '';
    try {
        const date = new Date(dateValue);
        // Example format: "Sat, 22 Nov"
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    } catch (e) {
        return 'Date TBD';
    }
}