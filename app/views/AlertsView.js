//The AlertsView shows the alerts associated with a user.
Brandwatch.views.AlertsView = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'card',

    initComponent:function ()
    {
        Brandwatch.stores.alertsStore.clearFilter ();

        this.backButton = Brandwatch.controllers.backButton;

        this.topToolbar = new Ext.Toolbar
        ({
            title:'Alerts',
            items:
            [
                this.backButton,
                {xtype:'spacer'},
                {
                    iconCls  :'search',
                    iconMask :true,
                    ui       :'plain',
                    listeners:
                    {
                        scope:this,
                        tap  :this.onSearchTap
                    }
                }
            ]
        });

        //Hidden Toolbar showing when search icon has been clicked allowing to cancel search.
        this.cancelSearchAlertsToolbar = new Ext.Toolbar ({
            hidden:true,
            title :'Search Alerts',
            items :[
                {
                    xtype    :'button',
                    text     :'cancel',
                    ui       :'back',
                    cls      :'buttonText',
                    listeners:
                    {
                        scope:this,
                        tap  :this.onSearchCancel
                    }
                }
            ]
        });

        //Hidden Searchbar appearing below toolbar on search icon press allowing user to search alerts.
        this.searchBar = new Ext.Toolbar
        ({
            ui    :'light',
            hidden:true,
            cls   :'searchBar',
            items :
            [
                {
                    xtype      :'searchfield',
                    placeHolder:'Search',
                    name       :'searchfield',
                    listeners  :
                    {
                        scope:this,
                        keyup:this.onSearchInput
                    }
                }
            ]
        });

        this.dockedItems = [this.topToolbar, this.cancelSearchAlertsToolbar, this.searchBar];

        //Creates the list structure and fills it with data from the alertsStore.
        this.alertsList = new Ext.List
        ({
            store           :this.alertsStore,
            emptyText       :'<div style="margin:5px;">You have no alerts, please create one in your desktop version of Brandwatch.</div>',
            onItemDisclosure:true,
            itemTpl         :'<div class="list-item-title">{name}</div>' +
                             '<div class="list-item-narrative">{narrative}</div>'
        });

        //Adds the list to a panel allowing for vertical scrolling.
        this.listPanel = new Ext.Panel
        ({
            items :[this.alertsList],
            scroll:'vertical',
            layout:'fit'
        });

        //Handles the on click event of a list item.
        this.alertsList.on ('itemtap', function (dataview, index, item, e)
        {
            var record = dataview.getRecord (item);
            this.onAlertSelection (record);
        },  this),

            this.items = [this.listPanel];

        Brandwatch.views.LandingView.superclass.initComponent.call (this);
    },

    //Function handling the navigation of each list item via the controller.
    onAlertSelection:function (record)
    {
        var dispatchOptions =
        {
            controller:Brandwatch.controllers.controller,
            action    :'onShowAlertView'
        }

        Brandwatch.controllers.backButton.addToBackStack (dispatchOptions);

        Ext.dispatch
        ({
            controller:Brandwatch.controllers.controller,
            action    :'onAlertSelection',
            data      :record,
            historyUrl:'alerts'
        });
    },

    //Function handling the search input by filtering the project ignoring casing.
    onSearchInput:function (field)
    {
        var searchTerm = field.getValue ().toLowerCase ();

        Brandwatch.stores.alertsStore.filterBy (function (record)
        {
            if (record.get ('name').toLowerCase ().match (".*" + searchTerm + ".*"))
            {
                return true;
            }
            return false;
        });
    },

    //Function handling the way the Search toolbar is displayed.
    onSearchTap:function ()
    {
        this.cancelSearchAlertsToolbar.setVisible (true);
        this.cancelSearchAlertsToolbar.setPosition (0, 0);
        this.cancelSearchAlertsToolbar.setWidth (this.getWidth ());
        this.topToolbar.hide ();
        this.searchBar.setVisible (true);
        this.searchBar.setWidth (this.getWidth ());
        this.searchBar.setHeight (40);
        this.listPanel.setPosition (0, 40);
    },

    //Function handling the way the Search toolbar is hidden.
    onSearchCancel:function ()
    {
        this.cancelSearchAlertsToolbar.hide ();
        this.topToolbar.setVisible (true);
        this.searchBar.hide ();
        this.listPanel.setPosition (0, 0);
    }
});