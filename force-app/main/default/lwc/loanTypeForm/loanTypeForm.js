import { api, LightningElement } from 'lwc';

export default class LoanTypeForm extends LightningElement {

    applicantName = '';
    applicantEmail = '';
    applicantPAN = '';
    applicantAadhar = '';
    loanType = '';
    loanTypeOptions = [
        { label: 'Home Loan', value: 'Home Loan' },
        { label: 'Personal Loan', value: 'Personal Loan' },
        { label: 'Business Loan', value: 'Business Loan' }
    ];
    
    handleChange(event) {
        const field = event.target.name;
        if(field == 'applicantName'){
            this.applicantName = event.target.value;
        }
        else if(field == 'applicantEmail'){
            this.applicantEmail = event.target.value;
        }
        else if(field == 'applicantPAN'){   
            this.applicantPAN = event.target.value;
        }
        else{
            this.applicantAadhar = event.target.value;
        }
    }

    handleLoanTypeChange(event){
        this.loanType = event.detail.value;
        if(this.loanType == 'Home Loan'){
            this.isHomeLoan = true;
            this.isPersonalLoan = false;
            this.isBusinessLoan = false;
        }
        else if(this.loanType == 'Personal Loan'){
            this.isHomeLoan = false;
            this.isPersonalLoan = true;
            this.isBusinessLoan = false;
        }
        else{
            this.isHomeLoan = false;
            this.isPersonalLoan = false;
            this.isBusinessLoan = true;
        }

    }
    



}