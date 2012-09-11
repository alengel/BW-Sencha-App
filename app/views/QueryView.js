//The QueryView shows the queries associated with a user project.
Brandwatch.views.QueryView = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'card',

    initComponent:function ()
    {

        this.backButton = Brandwatch.controllers.backButton;

        this.topToolbar = new Ext.Toolbar
        ({
            title:'Queries',
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
        this.cancelSearchQueriesToolbar = new Ext.Toolbar
        ({
            hidden:true,
            title :'Search Queries',
            items :
            [
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

        //Hidden Searchbar appearing below toolbar on search icon press allowing user to search projects.
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

        this.dockedItems = [this.topToolbar, this.cancelSearchQueriesToolbar, this.searchBar];

        //Creates the list structure and fills it with data from the queryStore.
        this.queryList = new Ext.List
        ({
            store           :this.queryStore,
            emptyText       :'<div style="margin:5px;">No queries cached.</div>',
            onItemDisclosure:true,
            itemTpl         :'<div class="list-item-title">{name}</div>'
        });

        //Adds the list to a panel allowing for vertical scrolling.
        this.listPanel = new Ext.Panel ({
            items :[this.queryList],
            scroll:'vertical',
            layout:'fit'
        });

        //Handles the on click event of a list item.
        this.queryList.on ('itemtap', function (dataview, index, item, e)
        {
            var record = dataview.getRecord (item);
            this.onQuerySelection (record);
        }, this),

            this.items = [this.listPanel];

        Brandwatch.views.QueryView.superclass.initComponent.call (this);
    },

    //Function handling the navigation of each list item via the controller.
    onQuerySelection:function (record)
    {

        var dispatchOptions =
        {
            controller:Brandwatch.controllers.controller,
            action    :'onProjectSelection',
            data      :{data:Brandwatch.stores.settingsStore.findRecord ('name', 'lastProject').get ('value')}
        };

        Brandwatch.controllers.backButton.addToBackStack (dispatchOptions);

        Ext.dispatch ({
            controller:Brandwatch.controllers.controller,
            action    :'onQuerySelection',
            data      :record,
            historyUrl:'overview'
        });
    },

    //Function handling the search input by filtering the project ignoring casing.
    onSearchInput:function (field)
    {
        var searchTerm = field.getValue ().toLowerCase ();

        Brandwatch.stores.queryStore.filterBy (function (record)
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
        this.cancelSearchQueriesToolbar.setVisible (true);
        this.cancelSearchQueriesToolbar.setPosition (0, 0);
        this.cancelSearchQueriesToolbar.setWidth (this.getWidth ());
        this.topToolbar.hide ();
        this.searchBar.setVisible (true);
        this.searchBar.setWidth (this.getWidth ());
        this.searchBar.setHeight (40);
        this.listPanel.setPosition (0, 40);
    },

    //Function handling the way the Search toolbar is hidden.
    onSearchCancel:function ()
    {
        this.cancelSearchQueriesToolbar.hide ();
        this.topToolbar.setVisible (true);
        this.searchBar.hide ();
        this.listPanel.setPosition (0, 0);
    }
});