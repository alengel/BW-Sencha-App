var key = null;
var overview = null;
var summaryView = null;

Ext.regController ('Controller', {

    controller:this,

    //Function setting the first application page.
    "setFirstApplicationPage":function (options)
    {
        if (!Brandwatch.views.mainView)
        {
            Brandwatch.views.mainView = new Brandwatch.views.AppMainView ();

            if (Ext.is.Android)
            {
                hideAddressBar ();
            }
        }
        else
        {
            Brandwatch.views.mainView.setActiveItem (Brandwatch.views.LoginView)
        }
    },

    //Function retrieving login values and sending API request.
    "onLogin":function (params)
    {
        var email = params.data.email;
        var password = params.data.password;

        this.spinner = new Ext.LoadMask (Ext.getBody (), {msg:'Loading...'});
        Ext.Ajax.on ('beforerequest', this.spinner.show, this.spinner);
        Ext.Ajax.on ('requestcomplete', this.spinner.hide, this.spinner);
        Ext.Ajax.on ('requestexception', this.spinner.hide, this.spinner);
        Ext.Ajax.request
        ({
            url    :'http://bwjsonapi.nodejitsu.com/login/',
            method :'POST',
            params :{username:Brandwatch.views.LoginView.getValues ().email, password:Brandwatch.views.LoginView.getValues ().password},
            success:function (e)
            {

                var response = e.responseText.replace ("OK{", "{");
                var json = Ext.util.JSON.decode (response);

                key = json.key;
                syncProjects (key);
                syncAlerts (key);

                Brandwatch.stores.settingsStore.load ();

                checkUser (email);

                //Saving persistant values to local storage.
                updateOrAddToStore (Brandwatch.stores.settingsStore, 'userEmail', email);
                updateOrAddToStore (Brandwatch.stores.settingsStore, 'key', key);
                updateOrAddToStore (Brandwatch.stores.settingsStore, 'startDate', new Date ().add (Date.DAY, -7));
                updateOrAddToStore (Brandwatch.stores.settingsStore, 'endDate', new Date ());

                setLandingPanel ();

                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'showLandingView'
                });
            },
            failure:function (e)
            {
                var fieldset = Ext.getCmp ('login');
                fieldset.setInstructions ("Login failed. Please retry. If you've forgotten your password please use the link below the input 												boxes.");
            }
        });
    },

    //Function setting the landing view page.
    "showLandingView":function ()
    {
        setLandingPanel ();
        Brandwatch.views.mainView.setActiveItem (new Brandwatch.views.LandingView ({landingStore:Brandwatch.stores.landingStore }));
    },

    //Function to log out of the application.
    "onLogout":function ()
    {
        if (confirm ('Are you sure you want to leave Brandwatch Mobile?'))
        {
            Brandwatch.views.mainView.setActiveItem (Brandwatch.views.LoginView,({type:'slide', direction:'right' }));
        }
    },

    //Function redirecting to the ProjectsView screen.
    "onShowProjectView":function ()
    {
        Brandwatch.views.mainView.setActiveItem (new Brandwatch.views.ProjectsView ({projectStore:Brandwatch.stores.projectStore}))
    },

    //Function redirecting to the AlertsView screen.
    "onShowAlertView":function ()
    {
        Brandwatch.views.mainView.setActiveItem (new Brandwatch.views.AlertsView ({alertsStore:Brandwatch.stores.alertsStore}))
    },

    //Function redirecting to the QueryView screen based on users project selection. Adds selected project to local storage.
    "onProjectSelection":function (record)
    {
        syncQueries (key, record.data.data.id);

        updateOrAddToStore (Brandwatch.stores.settingsStore, 'lastproject', record.data.data);

        Brandwatch.views.mainView.setActiveItem (new Brandwatch.views.QueryView ({queryStore:Brandwatch.stores.queryStore}))
    },

    //Function redirecting to the AlertsMentions screen based on users alert selection.
    "onAlertSelection":function (record)
    {
        updateOrAddToStore (Brandwatch.stores.settingsStore, 'startDate', new Date ().add (Date.DAY, -7).format ("Y-m-d"));
        updateOrAddToStore (Brandwatch.stores.settingsStore, 'endDate', new Date ().format ("Y-m-d"));

        var startDate = Brandwatch.stores.settingsStore.findRecord ('name', 'startDate').get ('value');
        var endDate = Brandwatch.stores.settingsStore.findRecord ('name', 'endDate').get ('value');

        syncAlertMentions (key, record.data.data.queryid, record.data.data.searchparams, startDate, endDate);

        updateOrAddToStore (Brandwatch.stores.settingsStore, 'lastalert', record.data.data);
		updateOrAddToStore (Brandwatch.stores.settingsStore, 'searchparams', record.data.data.searchparams);

        Brandwatch.views.mainView.setActiveItem (new Brandwatch.views.AlertsMentions ({alertsMentionsStore:Brandwatch.stores.alertsMentionsStore, record:record.data.data}))
    },

    //Function redirecting to the Dashboard screen based on users query selection. Adds selected query to local storage.
    "onQuerySelection":function (record)
    {
        if (summaryView != null)
        {
            summaryView.destroy ();
            summaryView = null;
        }

        updateOrAddToStore (Brandwatch.stores.settingsStore, 'startDate', new Date ().add (Date.DAY, -7).format ("Y-m-d"));
        updateOrAddToStore (Brandwatch.stores.settingsStore, 'endDate', new Date ().format ("Y-m-d"));

        var startDate = Brandwatch.stores.settingsStore.findRecord ('name', 'startDate').get ('value');
        var endDate = Brandwatch.stores.settingsStore.findRecord ('name', 'endDate').get ('value');

        //Function call from Sync.js making a summary API call to Brandwatch.
        getSummary (key, record.data.data.id, startDate, endDate);

        updateOrAddToStore (Brandwatch.stores.settingsStore, 'lastquery', record.data.data);

        var dashboardView = new Brandwatch.views.DashboardView ({record:record.data.data});

        Brandwatch.views.mainView.setActiveItem (dashboardView);
    },

    //Function making the Calendar screen the active screen in the application.
    "openCalendar":function (record)
    {
        Brandwatch.views.mainView.setActiveItem (new Brandwatch.views.Calendar ({record:record.data}))
    },

    //Function making the sentiment chart the active tab in the CarouselView screen.
    "toSentiment":function (record)
    {
        setTabPanel (0, record);
    },

    //Function making the history chart the active tab in the CarouselView screen.
    "toHistory":function (record)
    {
        setTabPanel (1, record);
    },

    //Function making the page type chart the active tab in the CarouselView screen.
    "toPagetype":function (record)
    {
        setTabPanel (2, record);
    },

    //Function making the top sites list the active tab in the CarouselView screen.
    "toTopsites":function (record)
    {
        setTabPanel (3, record);
    },

    //Function making the top tweeters list the active tab in the CarouselView screen.
    "toToptweeters":function (record)
    {
        setTabPanel (4, record);
    },

    //Function making the mentions list the active tab in the CarouselView screen.
    "toMentions":function (record)
    {
        setTabPanel (5, record);
    },

    //Function making the interaction screen the active screen.
    "onMentionSelection":function (record)
    {
        Brandwatch.views.mainView.setActiveItem (new Brandwatch.views.Interaction ({record:record.data.data}))
    },

    //Function making the Dashboard View the active screen.
    "backToDashboard":function (record)
    {
        var dashboardView = new Brandwatch.views.DashboardView ({record:record.data.data});
        Brandwatch.views.mainView.setActiveItem (dashboardView, {type:'slide', direction:'right' })
    },
	
	// Show view contained in the record parameter.
	'showview' : function(record)
    {
	   Brandwatch.views.mainView.setActiveItem(record.data.view);
    },
});

Brandwatch.controllers.controller = Ext.ControllerManager.get ('Controller');