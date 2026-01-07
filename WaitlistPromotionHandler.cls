public class WaitlistPromotionHandler {
    // static flag to stop recursion in same transaction
    private static Boolean hasRun = false;

    public static void promoteFromWaitlist(List<EventRegistration__c> newList, Map<Id, EventRegistration__c> oldMap) {
        if (hasRun) {
            System.debug('WaitlistPromotionHandler: already executed this transaction, exiting.');
            return;
        }
        hasRun = true;

        Set<Id> eventIds = new Set<Id>();

        // 1) Collect event ids where a registration changed TO 'Canceled' from something else
        for (EventRegistration__c reg : newList) {
            EventRegistration__c oldReg = oldMap.get(reg.Id);
            // Defensive: ensure oldReg is not null
            if (oldReg == null) continue;

            System.debug('Compare statuses - Id:' + reg.Id + ' Old:' + oldReg.Status__c + ' New:' + reg.Status__c);

            if (oldReg.Status__c != 'Canceled' && reg.Status__c == 'Canceled' && reg.Event_Name__c != null) {
                eventIds.add(reg.Event_Name__c);
                System.debug('Added event for promotion: ' + reg.Event_Name__c);
            }
        }

        if (eventIds.isEmpty()) {
            System.debug('WaitlistPromotionHandler: No canceled events found, nothing to do.');
            return;
        }

        // 2) Query earliest waitlisted registrations for those events
        List<EventRegistration__c> waitlisted = [
            SELECT Id, Name, Status__c, Event_Name__c, CreatedDate
            FROM EventRegistration__c
            WHERE Event_Name__c IN :eventIds
              AND Status__c = 'Waitlisted'
            ORDER BY CreatedDate ASC
        ];

        if (waitlisted.isEmpty()) {
            System.debug('WaitlistPromotionHandler: No waitlisted registrations found for events: ' + eventIds);
            return;
        }

        // 3) Pick earliest per event
        Map<Id, EventRegistration__c> earliestPerEvent = new Map<Id, EventRegistration__c>();
        for (EventRegistration__c w : waitlisted) {
            if (!earliestPerEvent.containsKey(w.Event_Name__c)) {
                earliestPerEvent.put(w.Event_Name__c, w);
            }
        }

        // 4) Promote selected records
        List<EventRegistration__c> toUpdate = new List<EventRegistration__c>();
        for (EventRegistration__c prom : earliestPerEvent.values()) {
            // safety: skip if somehow the selected record is the one that was just canceled (shouldn't happen)
            if (prom.Status__c == 'Waitlisted') {
                prom.Status__c = 'Confirmed';
                toUpdate.add(prom);
                System.debug('Promoting waitlisted reg Id=' + prom.Id + ' Name=' + prom.Name + ' Event=' + prom.Event_Name__c);
            }
        }

        if (!toUpdate.isEmpty()) {
            try {
                update toUpdate;
                System.debug('WaitlistPromotionHandler: promoted records updated: ' + toUpdate);
            } catch (DmlException ex) {
                System.debug('WaitlistPromotionHandler: DML error during promotion: ' + ex.getMessage());
                throw ex;
            }
        } else {
            System.debug('WaitlistPromotionHandler: nothing to update after selection.');
        }
    }
}