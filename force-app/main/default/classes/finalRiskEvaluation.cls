public with sharing class finalRiskEvaluation {

    @InvocableMethod(label='Calculate Final Risk')
    public static void calculateFinalRisk(List<Id> loanIds) {
        List<Loan_Applications__c> loanApps = [
            SELECT Income_Risk__c, Credit_Risk__c
            FROM Loan_Applications__c
            WHERE Id IN :loanIds
        ];

        for (Loan_Applications__c app : loanApps) {
            String incomeRisk = app.Income_Risk__c;
            String creditRisk = app.Credit_Risk__c;
            String finalRisk;

            if (incomeRisk == 'Low' && creditRisk == 'Low') finalRisk = 'Low';
            else if (incomeRisk == 'High' && creditRisk == 'High') finalRisk = 'High';
            else finalRisk = 'Medium';

            app.Risk__c = finalRisk;
        }

        update loanApps;
    }
}