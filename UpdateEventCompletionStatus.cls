global class UpdateEventCompletionStatus implements Schedulable {
    global void execute(SchedulableContext sc) {
        List<Event__c> eventsToUpdate = new List<Event__c>();
        for (Event__c evt : [SELECT Id, End_Date__c	, Is_Completed__c FROM Event__c WHERE End_Date__c	 < :Date.today() AND Is_Completed__c = FALSE]) {
            evt.Is_Completed__c = TRUE;
            eventsToUpdate.add(evt);
        }
        if (!eventsToUpdate.isEmpty()) {
            update eventsToUpdate;
        }
    }
}