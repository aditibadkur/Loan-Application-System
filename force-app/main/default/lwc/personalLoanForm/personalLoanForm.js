import addNewApplicants from '@salesforce/apex/addNewApplicant.addNewApplicants';
import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PersonalLoanForm extends LightningElement {
    @api message;
    @api myRecordId;

    get acceptedFormats() {
        return ['.pdf'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        alert('No. of files uploaded : ' + uploadedFiles.length);
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.type === 'number' 
        ? event.target.value.toString() // Convert number to string
        : event.target.value;
    }

    handleSubmit() {
        this.clearFields();
        // addNewApplicants({
        //     totalLoans: this.totalLoans
        // })
        // .then(result => {
        //     this.showToast('Success', 'Application submitted!', 'success');
        //     this.clearFields();
        // })
        // .catch(error => {
        //     this.showToast('Error', error.body.message, 'error');
        //     console.log("error: " + error.body.message);
        // });
    }

    // clearFields() {
    //     this.totalLoans = '';
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
    }

    showToast(title, message, variant) {
            this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}