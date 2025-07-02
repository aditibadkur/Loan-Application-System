public with sharing class fileUpload {
    @AuraEnabled(cacheable=false)
    public static List<ContentDocumentLink> fetchFiles(String recordId){
        return [SELECT LinkedEntityId, 
                ContentDocument.CreatedDate, 
                ContentDocument.Title, 
                ContentDocument.ContentSize, 
                ContentDocument.FileType 
                FROM ContentDocumentLink  
                WHERE LinkedEntityId  =:recordId];
    }
}