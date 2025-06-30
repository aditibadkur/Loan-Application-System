import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addNewApplicants from '@salesforce/apex/addNewApplicant.addNewApplicants';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

import OBJECT_API from '@salesforce/schema/Loan_Applications__c';
import TYPE_FIELD from '@salesforce/schema/Loan_Applications__c.Loan_Type__c';
import DURATION_FIELD from '@salesforce/schema/Loan_Applications__c.Duration__c';
import TOTAL_LOANS_FIELD from '@salesforce/schema/Loan_Applications__c.Total_Loans_Pending__c';


export default class LoanTypeForm extends LightningElement {

    // @track recordId; // this is giving the current record Id not checking ki previous wala hai ya nhi

    @track applicantName = '';
    @track applicantEmail = '';
    @track applicantPAN = '';
    @track applicantAadhar = '';
    @track applicantPhone = '';
    @track applicantAnnualIncome = '';
    @track applicantAmount = '';

    @track loanType = '';
    @track loanTypeOptions = [];
    @track isHomeLoan = false;
    @track isPersonalLoan = false;
    @track isBusinessLoan = false;

    @track formDisabled = false; 
    @track isNext = false;

    @track loanDuration = '';
    @track loanDurationOptions = [];

    @track totalLoans = '';
    @track PendingLoansOptions = [];

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() // Convert number to string
        : event.target.value;
    }

    @wire(getObjectInfo, { objectApiName: OBJECT_API })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: TYPE_FIELD })
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.loanTypeOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.loanTypeOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load loan types', 'error');
        }
    }

    handleLoanTypeChange(event) {
        try {
            this.loanType = event.detail.value;
            this.isHomeLoan = this.loanType === 'Home Loan';
            this.isPersonalLoan = this.loanType === 'Personal Loan';
            this.isBusinessLoan = this.loanType === 'Business Loan';
            
            console.log('Selected loan type:', this.loanType);
            console.log('isHomeLoan:', this.isHomeLoan);
            console.log('isPersonalLoan:', this.isPersonalLoan);
            console.log('isBusinessLoan:', this.isBusinessLoan);
        } catch (e) {
            console.error('Combobox error:', e);
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: DURATION_FIELD })
    wiredDurationPicklistValues({ error, data }) {
        if (data) {
            this.loanDurationOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.loanDurationOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load loan DURATION', 'error');
        }
    }

    handleDurationChange(event){
        try {
            this.loanDuration = event.detail.value;
            console.log('Selected loan duration:', this.loanDuration);
        } catch (e) {
            console.error('Combobox error:', e);
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: TOTAL_LOANS_FIELD })
    wiredLoansPendingPicklistValues({ error, data }) {
        if (data) {
            this.pendingLoansOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('Picklist options loaded:', this.loanDurationOptions);
        } else if (error) {
            console.error('Error loading picklist values:', error);
            this.showToast('Error', 'Failed to load PENDING loans', 'error');
        }
    }

    handlePendingLoansChange(event){
        try {
            this.totalLoans = event.detail.value;
            console.log('Selected loan duration:', this.loanDuration);
        } catch (e) {
            console.error('Combobox error:', e);
        }
    }

    handleNext() {
        if (!this.applicantEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            this.showToast('Error', 'Invalid email format', 'error');
            return;
        }

        if (!this.applicantPAN.match(/^[A-Z0-9]{10}$/)) {
            this.showToast('Error', 'PAN must be 10 characters (A-Z, 0-9)', 'error');
            return;
        }

        if (!this.applicantAadhar.match(/^\d{12}$/)) {
            this.showToast('Error', 'Aadhar must be 12 digits', 'error');
            return;
        }

        if (!this.applicantPhone.match(/^\d{10}$/)) {
            this.showToast('Error', 'Phone number must be 10 digits', 'error');
            return;
        }

        this.isNext = true;
        this.formDisabled = true;

        // if(this.recordId){ // yeh logic nhi chal rha
        //     // Update the existing record instead of creating a new one
        //     addNewApplicants({
        //         applicantName: this.applicantName,
        //         applicantEmail: this.applicantEmail,
        //         applicantPAN: this.applicantPAN,
        //         applicantAadhar: this.applicantAadhar,
        //         loanType: this.loanType,
        //         applicantPhone: this.applicantPhone, 
        //         applicantAnnualIncome: this.applicantAnnualIncome,
        //         applicantAmount: this.applicantAmount,
        //         loanDuration: this.loanDuration, 
        //     })
        //     .then(result => {
        //         this.showToast('Success', 'Record Updated!', 'success');
        //         console.log('Updating:', {
        //             name: this.applicantName,
        //             email: this.applicantEmail,
        //             pan: this.applicantPAN,
        //             aadhar: this.applicantAadhar,
        //             loanType: this.loanType,
        //             phone: this.applicantPhone
        //         });
        //     })
        //     .catch(error => {
        //         this.showToast('Record not updated', error.body.message, 'error');
        //         console.log("error: "+error.body.message);
        //     });
        // }
        // else{
            addNewApplicants({
                applicantName: this.applicantName,
                applicantEmail: this.applicantEmail,
                applicantPAN: this.applicantPAN,
                applicantAadhar: this.applicantAadhar,
                loanType: this.loanType,
                applicantPhone: this.applicantPhone, 
                applicantAnnualIncome: this.applicantAnnualIncome,
                applicantAmount: this.applicantAmount,
                loanDuration: this.loanDuration, 
                totalLoans: this.totalLoans,
            })
            .then(result => {
                this.showToast('Success', 'Record Created!', 'success');
                // this.showToast('Success', 'Record Created! Id: ' + this.recordId, 'success');
                console.log('Submitting:', {
                    name: this.applicantName,
                    email: this.applicantEmail,
                    pan: this.applicantPAN,
                    aadhar: this.applicantAadhar,
                    loanType: this.loanType,
                    phone: this.applicantPhone,
                    annualIncome: this.applicantAnnualIncome,
                    amount: this.applicantAmount,
                    loanDuration: this.loanDuration,
                    totalLoans: this.totalLoans
                });
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
                console.log("error: "+error.body.message);
            });
        }

    // }

    get showHomeLoanForm() {
        return this.isHomeLoan && this.isNext;
    }

    get showPersonalLoanForm() {
        return this.isPersonalLoan && this.isNext;
    }

    get showBusinessLoanForm() {
        return this.isBusinessLoan && this.isNext;  
    }

    handleBack() { 
        this.isNext = false;
        this.formDisabled = false;
        this.showToast('Info', 'You can edit your details now', 'info');
        // getRecordID so that update usme hi ho direct no extra/duplicate record formed
        this.clearFields();
    }

    clearFields() {
        this.applicantName = '';
        this.applicantEmail = '';
        this.applicantPAN = '';
        this.applicantAadhar = '';
        this.loanType = '';
        this.applicantPhone = '';
        this.applicantAnnualIncome = '';
        this.applicantAmount = '';
        this.isHomeLoan = false;
        this.isPersonalLoan = false;
        this.isBusinessLoan = false;
        this.loanDuration = '';
        this.isNext = false;
        this.formDisabled = false;
        this.totalLoans = '';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

}

