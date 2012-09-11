//Stores the data for the page type chart.
Ext.regStore ('PagetypeStore', {
    model:'PagetypeModel'
});

Brandwatch.stores.pagetypeStore = Ext.StoreMgr.get ('PagetypeStore');