//Stores the data for the alerts.
Ext.regStore ('AlertsStore', {
    model:'AlertsModel'
});

Brandwatch.stores.alertsStore = Ext.StoreMgr.get ('AlertsStore');