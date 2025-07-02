import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchFiles from '@salesforce/apex/fileUpload.fetchFiles';

export default class ShowFile extends LightningElement {
    @api recordId;
    @track isFileLoaded = true;
    @track files;
    @track error;
    _lastRecordIdFetched;

    renderedCallback() {
        if (this.recordId && this.recordId !== this._lastRecordIdFetched) {
            this.getFiles();
            this._lastRecordIdFetched = this.recordId;
        }
    }

    @api // on every upload call hota from parent, hence api is needed (so that all files are fetched)
    getFiles() { 
        fetchFiles({ recordId: this.recordId })
            .then(result => {
                // isse size aane lag gaya!!!!! (since method directly call nhi hota, toh add as property to each file)
                this.files = result.map(file => ({
                    ...file,
                    formattedSize: this.formattedSize(file.ContentDocument.ContentSize)
                }));
                this.error = undefined;
                if (!result || result.length === 0) {
                    this.isFileLoaded = false;
                    this.showToast('No Files', 'No files found for this record.', 'info');
                } else {
                    this.isFileLoaded = true;
                }
            })
            .catch(error => {
                this.error = error;
                this.files = undefined;
                this.isFileLoaded = false;
                this.showToast('Error', 'Error fetching files: ' + (error.body?.message || error.message), 'error');
            });
    }

    handleViewFile(event) {
        const contentDocumentId = event.currentTarget.dataset.id;
        // Salesforce standard file viewer URL
        window.open(`/sfc/servlet.shepherd/document/preview/${contentDocumentId}`, '_self');
    }

    formattedSize(size) {
        if (size < 1024) return size + ' B';
        if (size < 1048576) return Math.round(size / 102.4) / 10 + ' KB';
        return Math.round(size / 104857.6) / 10 + ' MB';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title,  message, variant }));
    }
}