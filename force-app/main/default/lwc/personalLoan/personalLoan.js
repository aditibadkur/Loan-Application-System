import { LightningElement, api, wire } from 'lwc';
import getData from '@salesforce/apex/getApplicantData.getData';

export default class PersonalLoan extends LightningElement {
    @api recordId;
    isLoading = true;
    applicationData = {};
    error;
    
    @wire(getData, { recordId: '$recordId' })
    wiredApplication({ error, data }) {
        this.isLoading = false;
        
        if (data) {
            this.applicationData = data.length > 0 ? {
                ...data[0], 
                formattedLoanAmount: this.formatCurrency(data[0].Loan_Amount__c),
                formattedIncome: this.formatCurrency(data[0].Annual_Income__c)
            } : {};
            this.error = undefined;
        } else if (error) {
            this.error = error.body ? error.body.message : 'Unknown error';
            this.applicationData = {};
        }
    }
    
    formatCurrency(value) {
        return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR' 
        }).format(value || 0);
    }
    
    get hasApplications() {
        return this.applicationData && this.applicationData.Id;
    }
    
    get loanType() {
        return this.applicationData?.Loan_Type__c || 'Not specified';
    }
}