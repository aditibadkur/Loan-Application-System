import { api, LightningElement } from 'lwc';

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
}