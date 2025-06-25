public with sharing class finalRiskEvaluation {
    @InvocableMethod(label='Calculate Final Risk')
    public finalRiskEvaluation(List<Id> loanIds) {
        List<Loan_Application__c> loanApps = [
            SELECT Id, Income_Risk__c, Credit_Risk__c
            FROM Loan_Application__c
            WHERE Id IN :loanIds
        ];

        for (Loan_Application__c app : loanApps) {
            String incomeRisk = app.Income_Risk__c;
            String creditRisk = app.Credit_Risk__c;
            String finalRisk;

            if (incomeRisk == 'Low' && creditRisk == 'Low') finalRisk = 'Low';
            else if (incomeRisk == 'High' && creditRisk == 'High') finalRisk = 'High';
            else finalRisk = 'Medium';

            app.Final_Risk__c = finalRisk;
        }

        update loanApps;
    }
}