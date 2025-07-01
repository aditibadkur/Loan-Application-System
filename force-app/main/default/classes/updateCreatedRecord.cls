public with sharing class updateCreatedRecord {
    @AuraEnabled
    public static void updateHomeLoanRecord(
        String recordId, 
        String creditScore
    ) {
        try {
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


    // public static void updatePersonalLoanRecord(
    //     String recordId, 
    //     String creditScore
    // ) {
    //     try {
    //         Loan_Applications__c loan = [
    //             SELECT Id, Credit_Score__c
    //             FROM Loan_Applications__c
    //             WHERE Id = :recordId
    //             LIMIT 1
    //         ];
    //         if (loan == null) {
    //             throw new AuraHandledException('Record not found with Id: ' + recordId);
    //         }
    //         loan.Credit_Score__c = creditScore;

    //         update loan;
    //     }
    //     catch(Exception e) {
    //         throw new AuraHandledException('Error updating record: ' + e.getMessage());
    //     }
    // }


    // public static void updateBusinessLoanRecord(
    //     String recordId, 
    //     String creditScore
    // ) {
    //     try {
    //         Loan_Applications__c loan = [
    //             SELECT Id, Credit_Score__c
    //             FROM Loan_Applications__c
    //             WHERE Id = :recordId
    //             LIMIT 1
    //         ];
    //         if (loan == null) {
    //             throw new AuraHandledException('Record not found with Id: ' + recordId);
    //         }
    //         loan.Credit_Score__c = creditScore;

    //         update loan;
    //     }
    //     catch(Exception e) {
    //         throw new AuraHandledException('Error updating record: ' + e.getMessage());
    //     }
    // }
    
}