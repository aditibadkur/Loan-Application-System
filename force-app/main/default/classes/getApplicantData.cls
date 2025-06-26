public with sharing class getApplicantData {
    @AuraEnabled(cacheable=true)
    public static List<Loan_Applications__c> getData(String recordId){
        return [SELECT Id, Name, Email__c, PAN_Card__c, Aadhar__c, 
                Loan_Type__c, Loan_Amount__c, Annual_Income__c,
                Duration__c, Credit_Score__c, Status__c
                FROM Loan_Applications__c
                WHERE Id = :recordId 
                ];
    }   
}