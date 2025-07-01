import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import updateHomeLoanRecord from '@salesforce/apex/updateCreatedRecord.updateHomeLoanRecord';
import OBJECT_API from '@salesforce/schema/Loan_Applications__c';
import CREDIT_SCORE_FIELD from '@salesforce/schema/Loan_Applications__c.Credit_Score__c';

export default class HomeLoanForm extends LightningElement {
    @api message;
    @api recordId; 
    @track formDisabled = false; 

    @track creditScore = '';
    @track creditScoreOptions = [];

    @wire(getObjectInfo, { objectApiName: OBJECT_API })
    objectInfo;
    
    @wire(getPicklistValues, {recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: CREDIT_SCORE_FIELD })
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.creditScoreOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
        } else if (error) {
            this.showToast('Error', 'Failed to load credit score options', 'error');
        }
    }

    handleCreditScoreChange(event) {
        this.creditScore = event.detail.value;  
    }

    handleSubmit() {
        if (!this.creditScore) {
            this.showToast('Error', 'Credit Score is required', 'error');
            return;
        }

        this.formDisabled = true;

        updateHomeLoanRecord({ 
            recordId: this.recordId, 
            creditScore: this.creditScore
        })
        .then(() => {
            this.showToast('Success', 'Record updated successfully!', 'success');
        })
        .catch(error => {
            this.formDisabled = false;
            const errorMessage = error.body?.message || error.message || 'Unknown error';
            this.showToast('Error', errorMessage, 'error');
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}