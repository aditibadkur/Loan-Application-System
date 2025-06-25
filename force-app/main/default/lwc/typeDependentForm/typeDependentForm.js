import { LightningElement, api } from 'lwc';

export default class LoanTypeDetails extends LightningElement {
    @api loanType;

    get isHomeLoan() {
        return this.loanType === 'Home Loan';
    }

    get isPersonalLoan() {
        return this.loanType === 'Personal Loan';
    }

    get isBusinessLoan() {
        return this.loanType === 'Business Loan';
    }
}
