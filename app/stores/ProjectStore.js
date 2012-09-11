//Stores the data for the project view.
Ext.regStore ('ProjectStore', {
    model:'ProjectModel'
});

Brandwatch.stores.projectStore = Ext.StoreMgr.get ('ProjectStore');