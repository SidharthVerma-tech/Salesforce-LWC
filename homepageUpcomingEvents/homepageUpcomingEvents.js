import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class HomepageUpcomingEvents extends NavigationMixin(LightningElement) {
    
   navigateToEventsPage() {
    this[NavigationMixin.Navigate]({
        type: 'comm__namedPage',
        attributes: {
            name: 'all_events__c' // ✅ Use the actual API Name of your custom page
        }
    });
}
}