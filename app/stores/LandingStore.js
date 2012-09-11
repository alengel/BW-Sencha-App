//Stores the data for the landing view screen.
Ext.regStore ('LandingStore', {
    model:'LandingModel',

    data:
    [
        { id:1, title:'Projects', narrative:'' },
        { id:2, title:'Last viewed project', narrative:'' },
        { id:3, title:'Last viewed query', narrative:'' },
        { id:4, title:'Alerts', narrative:'' }
    ]
});

Brandwatch.stores.landingStore = Ext.StoreMgr.get ('LandingStore');