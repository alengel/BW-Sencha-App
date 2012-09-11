//The LandingView is the first screen after login and gives 4 navigation options.
Brandwatch.views.LandingView = Ext.extend (Ext.Panel, {
    layout:'fit',

    //Initializes the LandingView screen.
    initComponent:function ()
    {
        this.logoutButton = new Ext.Button
        ({
            text   :'Logout',
            handler:function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'onLogout',
                    historyUrl:'setFirstApplicationPage'
                });
            }
        });

        this.bottomToolbar = new Ext.Toolbar
        ({
            id   :'username',
            title:getUsername (),
            dock :'bottom'
        });

        this.topToolbar = new Ext.Toolbar
        ({
            title:'Brandwatch',
            items:
            [
                {xtype:'spacer'},
                this.logoutButton
            ]
        });

        this.dockedItems = [this.topToolbar, this.bottomToolbar];

        //Creates the list structure and fills it with data from the landingStore.
        this.landingOptions = new Ext.List
        ({
            store           :this.landingStore,
            emptyText       :'<div style="margin:5px;">No notes cached.</div>',
            onItemDisclosure:true,
            itemTpl         :'<div class="list-item-title">{title}</div>' +
                '<div class="list-item-narrative">{narrative}</div>'
        });

        //Handles the on click behaviour of a list item.
        this.landingOptions.on ('itemtap', function (dataview, index, item, e)
        {
            var record = dataview.getRecord (item);
            this.onSelection (record);

        }, this),

            this.items = [this.landingOptions];

        Brandwatch.views.LandingView.superclass.initComponent.call (this);
    },

    //Function handling the navigation of each list item via the controller.
    onSelection:function (record)
    {

        var action = "";
        var historyUrl = "";
        var data = {"data":null};

        //If Projects is clicked, it will redirect to the project screen.
        if (record.data.id == '1')
        {
            historyUrl = 'projects',
                action = 'onShowProjectView';
            data.data = record;
        }

        //If Last Project is clicked, it will redirect to the last visited project screen showing queries.
        else if (record.data.id == '2')
        {
            for (var i = 0; i < Brandwatch.stores.settingsStore.getCount (); i++)
            {
                if (Brandwatch.stores.settingsStore.getAt (i).data.name == 'lastproject')
                {
                    historyUrl = 'queries',
                        action = 'onProjectSelection';
                    data.data = Brandwatch.stores.settingsStore.getAt (i).data.value;
                }
            }
        }

        //If Last Query is clicked, it will redirect to the last visited query screen showing the dashboard.
        else if (record.data.id == '3')
        {
            for (var i = 0; i < Brandwatch.stores.settingsStore.getCount (); i++)
            {
                if (Brandwatch.stores.settingsStore.getAt (i).data.name == 'lastquery')
                {
                    historyUrl = 'overview',
                        action = 'onQuerySelection';
                    data.data = Brandwatch.stores.settingsStore.getAt (i).data.value;
                }
            }
        }

        //If Alerts is clicked, it will redirect to the alerts screen.
        else if (record.data.id == '4')
        {
            for (var i = 0; i < Brandwatch.stores.settingsStore.getCount (); i++)
            {
                historyUrl = 'alerts',
                    action = 'onShowAlertView';
                data.data = record;
            }
        }

        //Holds the dispatch variable send to the controller in the onSelection function.
        var dispatchOptions =
        {
            controller:Brandwatch.controllers.controller,
            action    :'showLandingView'
        };

        //Part of the Back.js, handling the back button navigation, adding to the HistoryStack.
        Brandwatch.controllers.backButton.addToBackStack (dispatchOptions);

        //Adding to the URL after # initialized in BrandwatchMobile.js.
        Ext.dispatch ({
            historyUrl:historyUrl,
            controller:Brandwatch.controllers.controller,
            action    :action,
            data      :data
        });
    },

    //Updates the list with the total value of Projects, Queries and name of Last Project, Last Query.
    refreshList:function ()
    {
        this.landingOptions.refresh ();
    }
});

//Function retrieving the username from the settingsStore.
function getUsername ()
{

    for (var i = 0; i < Brandwatch.stores.settingsStore.getCount (); i++)
    {
        if (Brandwatch.stores.settingsStore.getAt (i).data.name == 'userEmail')
        {
            return Brandwatch.stores.settingsStore.getAt (i).data.value;
        }
    }
}