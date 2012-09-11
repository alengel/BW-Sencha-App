//Stores the data for the mentions list.
Ext.regStore ('MentionsStore', {
    model:'MentionsModel',

    load:function (callback, plugin)
    {
        var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
        var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id;
        var startDate = Brandwatch.stores.settingsStore.findRecord ('name', 'startDate').get ('value');
        var endDate = Brandwatch.stores.settingsStore.findRecord ('name', 'endDate').get ('value');
		
        var startIndex =  this.getCount == 0 ? 0 : this.getCount () + 1;
        
        populateMentions (key, queryID, startDate, endDate, this, null, null, null, startIndex = startIndex);
    }
});

Brandwatch.stores.mentionsStore = Ext.StoreMgr.get ('MentionsStore');