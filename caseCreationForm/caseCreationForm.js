import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';

const FIELDS = ['User.ContactId'];

export default class CaseCreationForm extends LightningElement {
    userContactId;
    caseId;

    @wire(getRecord, { recordId: USER_ID, fields: FIELDS })
    wiredUser({ error, data }) {
        if (data) {
            this.userContactId = data.fields.ContactId.value;
        } else if (error) {
            console.error('Error fetching ContactId:', error);
        }
    }

    handleSuccess(event) {
        this.caseId = event.detail.id;
    }
}