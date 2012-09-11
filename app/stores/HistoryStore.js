//Stores the data for the history chart.
Ext.regStore ('HistoryStore', {
    model:'HistoryModel'
});

Brandwatch.stores.historyStore = Ext.StoreMgr.get ('HistoryStore');