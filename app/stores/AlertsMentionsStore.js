//Stores the data for the alert mentions.
Ext.regStore ('AlertsMentionsStore', {
    model:'MentionsModel',
	
	load:function (callback, plugin)
    {
        var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
        var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastalert').get ('value').queryid;
        var startDate = Brandwatch.stores.settingsStore.findRecord ('name', 'startDate').get ('value');
        var endDate = Brandwatch.stores.settingsStore.findRecord ('name', 'endDate').get ('value');
		var searchParams = Brandwatch.stores.settingsStore.findRecord ('name', 'searchparams').get ('value');
		
        var startIndex =  this.getCount == 0 ? 0 : this.getCount () + 1;

        syncAlertMentions (key, queryID, searchParams, startDate, endDate, startIndex)
    }
});

Brandwatch.stores.alertsMentionsStore = Ext.StoreMgr.get ('AlertsMentionsStore');