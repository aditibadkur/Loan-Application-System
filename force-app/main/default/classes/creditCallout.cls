public with sharing class creditCallout { // kidhar bhi use nhi ho rha
    public static HttpResponse getDataCallout() {
        Http http = new Http();

        // named and external credentials ke through ho raha hai (endpoint, header, etc. are managed in Named Credential)
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:named_credential_name/data'); 
        req.setMethod('GET');
        System.debug(req);
        
        HttpResponse res;
        
        try {
            res = http.send(req);
            System.debug(res.getBody()); // parser
            if (res.getStatusCode() != 200) {
                throw new AuraHandledException('Callout failed with status code: ' + res.getStatusCode());
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error during callout: ' + e.getMessage());
        }
        
        return res; // update it to get credit score and fraud probability
    }
}