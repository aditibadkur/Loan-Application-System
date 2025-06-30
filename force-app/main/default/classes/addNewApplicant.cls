public with sharing class addNewApplicant {
    @AuraEnabled
    public static void addNewApplicants(
        String applicantName, 
        String applicantEmail, 
        String applicantPAN, 
        String applicantAadhar, 
        String loanType, 
        String applicantPhone, 
        String applicantAnnualIncome, 
        String applicantAmount, 
        String loanDuration, 
        String totalLoans // child component data
        ) {
        Loan_Applications__c appl = new Loan_Applications__c();
        appl.Name = applicantName;
        appl.Email__c = applicantEmail;
        appl.PAN_Card__c = applicantPAN;
        appl.Aadhar__c = Decimal.valueOf(applicantAadhar);
        appl.Loan_Type__c = loanType;
        appl.Phone__c = applicantPhone;
        appl.Annual_Income__c = Decimal.valueOf(applicantAnnualIncome);
        appl.Loan_Amount__c = Decimal.valueOf(applicantAmount);
        appl.Duration__c = loanDuration; 
        appl.Total_Loans_Pending__c = totalLoans;

        // Dummy data for required fields
        appl.Credit_Score__c = '700-749'; // Example credit score range

        insert appl;
    }
}