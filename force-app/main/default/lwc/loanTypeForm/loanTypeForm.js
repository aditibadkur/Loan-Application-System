import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addNewApplicants from '@salesforce/apex/addNewApplicant.addNewApplicants';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

import OBJECT_API from '@salesforce/schema/Loan_Applications__c';
import TYPE_FIELD from '@salesforce/schema/Loan_Applications__c.Loan_Type__c';
import DURATION_FIELD from '@salesforce/schema/Loan_Applications__c.Duration__c';
import TOTAL_LOANS_FIELD from '@salesforce/schema/Loan_Applications__c.Total_Loans_Pending__c';


export default class LoanTypeForm extends LightningElement {

    @track recordId; // this is giving the current record Id not checking ki previous wala hai ya nhi

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

        const requiredFields = {
            applicantName: 'Name',
            applicantEmail: 'Email',
            applicantPAN: 'PAN',
            applicantAadhar: 'Aadhar',
            loanType: 'Loan Type',
            applicantPhone: 'Phone',
            applicantAnnualIncome: 'Annual Income',
            applicantAmount: 'Loan Amount',
            loanDuration: 'Loan Duration',
            totalLoans: 'Pending Loans'
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            if (!this[field]) {
                this.showToast('Error', `${label} is required`, 'error');
                return;
            }
        }

        this.formDisabled = true;

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
            totalLoans: this.totalLoans
        })
        .then(result => {
            this.recordId = result; 
            this.showToast('Success', 'Record created successfully!', 'success');
            this.isNext = true;
            console.log('Record created with ID:', result);
        })
        .catch(error => {
            this.formDisabled = false;
            const errorMessage = error.message || error.body?.message || 'Unknown error';
            this.showToast('Error', errorMessage, 'error');
            console.error('Full error:', error);
        });
    }

    get showHomeLoanForm() {
        return this.isHomeLoan && this.isNext;
    }

    get showPersonalLoanForm() {
        return this.isPersonalLoan && this.isNext;
    }

    get showBusinessLoanForm() {
        return this.isBusinessLoan && this.isNext;  
    }

    // handleBack() { 
    //     this.isNext = false;
    //     this.formDisabled = false;
    //     this.showToast('Info', 'You can edit your details now', 'info');
    //     // getRecordID so that update usme hi ho direct no extra/duplicate record formed
    //     this.clearFields();
    // }

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

