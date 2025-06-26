public with sharing class addNewApplicant {
    @AuraEnabled
    public static void addNewApplicants(String applicantName, String applicantEmail, String applicantPAN, String applicantAadhar, String loanType) {
        Loan_Applications__c appl = new Loan_Applications__c();
        appl.Name = applicantName;
        appl.Email__c = applicantEmail;
        appl.PAN_Card__c = applicantPAN;
        appl.Aadhar__c = Decimal.valueOf(applicantAadhar);
        appl.Loan_Type__c = loanType;

        // Dummy data for required fields
        appl.Loan_Amount__c = 500000; // Example loan amount (₹500,000)
        appl.Annual_Income__c = 750000; // Example annual income (₹750,000)
        appl.Duration__c = '10 years'; // Loan duration in years
        appl.Credit_Score__c = '700-749'; // Example credit score range

        insert appl;
    }
}