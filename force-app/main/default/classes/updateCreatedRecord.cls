public with sharing class updateCreatedRecord {
    @AuraEnabled(cacheable=true)
    public static void updateCreatedRecords(
        String recordId, 
        String creditScore
    ) {
        try {
            // Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(jsonData);

            Loan_Applications__c loan = [
                SELECT Id, Credit_Score__c
                FROM Loan_Applications__c
                WHERE Id = :recordId
                LIMIT 1
            ];
            if (loan == null) {
                throw new AuraHandledException('Record not found with Id: ' + recordId);
            }
            loan.Credit_Score__c = creditScore;

            update loan;
        }
        catch(Exception e) {
            throw new AuraHandledException('Error updating record: ' + e.getMessage());
        }
    }
}