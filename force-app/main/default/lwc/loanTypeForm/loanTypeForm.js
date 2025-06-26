import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import addNewApplicants from '@salesforce/apex/addNewApplicant.addNewApplicants';

export default class LoanTypeForm extends LightningElement {
    
    applicantName = '';
    applicantEmail = '';
    applicantPAN = '';
    applicantAadhar = '';
    loanType = '';


    @track isHomeLoan = false;
    @track isPersonalLoan = false;
    @track isBusinessLoan = false;

    loanTypeOptions = [
        { label: 'Home Loan', value: 'Home Loan' },
        { label: 'Personal Loan', value: 'Personal Loan' },
        { label: 'Business Loan', value: 'Business Loan' }
    ];

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() // Convert number to string
        : event.target.value;
    }

    handleLoanTypeChange(event) {
        try {
            this.loanType = event.detail.value;
            this.isHomeLoan = this.loanType === 'Home Loan';
            this.isPersonalLoan = this.loanType === 'Personal Loan';
            this.isBusinessLoan = this.loanType === 'Business Loan';
        } catch (e) {
            console.error('Combobox error:', e);
        }
    }

    handleSubmit() {
        if (!this.applicantPAN.match(/^[A-Z0-9]{10}$/)) {
            this.showToast('Error', 'PAN must be 10 characters (A-Z, 0-9)', 'error');
            return;
        }

        if (!this.applicantAadhar.match(/^\d{12}$/)) {
            this.showToast('Error', 'Aadhar must be 12 digits', 'error');
            return;
        }

        if (!this.applicantEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            this.showToast('Error', 'Invalid email format', 'error');
            return;
        }

        addNewApplicants({
            applicantName: this.applicantName,
            applicantEmail: this.applicantEmail,
            applicantPAN: this.applicantPAN,
            applicantAadhar: this.applicantAadhar,
            loanType: this.loanType
        })
        .then(result => {
            this.showToast('Success', 'Application submitted!', 'success');
            this.clearFields();
            console.log('Submitting:', {
                name: this.applicantName,
                email: this.applicantEmail,
                pan: this.applicantPAN,
                aadhar: this.applicantAadhar,
                loanType: this.loanType
            });
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
            console.log("Adi error: "+error.body.message);
        });
    }

    clearFields() {
        this.applicantName = '';
        this.applicantEmail = '';
        this.applicantPAN = '';
        this.applicantAadhar = '';
        this.loanType = '';
        this.isHomeLoan = false;
        this.isPersonalLoan = false;
        this.isBusinessLoan = false;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }

}

