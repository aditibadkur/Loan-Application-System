import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';

export default class LoanTypeForm extends LightningElement {
    userId = USER_ID;

    handleSubmit(event) {
        console.log('Submitting form...');
    }

    handleSuccess(event) {
        console.log('Record created successfully: ' + event.detail.id);
    }
}
