import addNewApplicants from '@salesforce/apex/addNewApplicant.addNewApplicants';
import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PersonalLoanForm extends LightningElement {
    @api message;
}