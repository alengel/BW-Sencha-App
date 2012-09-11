//Stores the data for the filtered mentions retrieved when segment of dashboard component is selected.
Ext.regStore ('FilteredMentionsStore', {
    model:'MentionsModel',
    load :function (callback, plugin)
    {
        var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
        var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id;
        var projectID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastproject').get ('value').id;
        var startDate = Brandwatch.stores.settingsStore.findRecord ('name', 'startDate').get ('value');
        var endDate = Brandwatch.stores.settingsStore.findRecord ('name', 'endDate').get ('value');
        var startIndex = this.getCount () + 1;

        populateMentions (key, queryID, startDate, endDate, this, null, null, null, startIndex = startIndex)
    }
});

Brandwatch.stores.filteredMentionsStore = Ext.StoreMgr.get ('FilteredMentionsStore');