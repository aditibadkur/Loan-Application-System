import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import OBJECT_API from '@salesforce/schema/Loan_Applications__c';
import CREDIT_SCORE_FIELD from '@salesforce/schema/Loan_Applications__c.Credit_Score__c';

export default class HomeLoanForm extends LightningElement {
    @api message;
    @track formDisabled = false; 

    @wire(getObjectInfo, { objectApiName: OBJECT_API })
        objectInfo;
    
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: CREDIT_SCORE_FIELD })
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.creditScoreOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.creditScoreOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load loan types', 'error');
        }
    }

    handleCreditScoreChange(event){
        try {
            this.creditScore = event.detail.value;  
            console.log('Selected credit score:', this.creditScore);
        } catch (e) {
            console.error('Error in handleCreditScoreChange:', e);
            this.showToast('Error', 'Failed to update credit score', 'error');
        }
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }

    handleSubmit() {
        this.formDisabled = true;
        const data = {
            creditScore: this.creditScore
        };

        updateBusinessLoanRecord({ 
            recordId: this.recordId, 
            jsonData: JSON.stringify(data) // OR MAYBE JUST ADD THE DATA AS IT IS, TO KEEP CHECK IN APEX CLASS
        })
        .then(() => {
            this.showToast('Success', 'Record updated!', 'success');
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    clearFields() {
        this.formDisabled = false;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}