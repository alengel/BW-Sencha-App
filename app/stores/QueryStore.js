//Stores the data for the query view.
Ext.regStore ('QueryStore', {
    model:'QueryModel'
});

Brandwatch.stores.queryStore = Ext.StoreMgr.get ('QueryStore');