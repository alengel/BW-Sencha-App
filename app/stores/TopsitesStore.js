//Stores the data for the top sites list.
Ext.regStore ('TopsitesStore', {
    model:'TopsitesModel'
});

Brandwatch.stores.topsitesStore = Ext.StoreMgr.get ('TopsitesStore');