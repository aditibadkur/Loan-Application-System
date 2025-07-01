public with sharing class addNewApplicant {
    @AuraEnabled
    public static String addNewApplicants(
        String applicantName, 
        String applicantEmail, 
        String applicantPAN, 
        String applicantAadhar, 
        String loanType, 
        String applicantPhone, 
        String applicantAnnualIncome, 
        String applicantAmount, 
        String loanDuration, 
        String totalLoans
    ) {
        try {
            Loan_Applications__c appl = new Loan_Applications__c();
            appl.Name = applicantName;
            appl.Email__c = applicantEmail;
            appl.PAN_Card__c = applicantPAN;
            appl.Aadhar__c = applicantAadhar != null ? Decimal.valueOf(applicantAadhar) : null;
            appl.Loan_Type__c = loanType;
            appl.Phone__c = applicantPhone;
            appl.Annual_Income__c = applicantAnnualIncome != null ? Decimal.valueOf(applicantAnnualIncome) : null;
            appl.Loan_Amount__c = applicantAmount != null ? Decimal.valueOf(applicantAmount) : null;
            appl.Duration__c = loanDuration; 
            appl.Total_Loans_Pending__c = totalLoans;
            appl.Credit_Score__c = '700-749';

            insert appl;
            return appl.Id;
        } catch(Exception e) {
            throw new AuraHandledException('Error creating application: ' + e.getMessage());
        }
    }
}