//The ProjectView shows the projects associated with a user.
Brandwatch.views.ProjectsView = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'card',

    initComponent:function ()
    {

        Brandwatch.stores.projectStore.clearFilter ();

        this.backButton = Brandwatch.controllers.backButton;

        this.topToolbar = new Ext.Toolbar
        ({
            title:'Projects',
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
        this.cancelSearchProjectsToolbar = new Ext.Toolbar
        ({
            hidden:true,
            title :'Search Projects',
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

        this.dockedItems = [this.topToolbar, this.cancelSearchProjectsToolbar, this.searchBar];

        //Creates the list structure and fills it with data from the projectStore.
        this.projectList = new Ext.List
        ({
            id              :'projects',
            store           :this.projectStore,
            emptyText       :'<div style="margin:5px;">You have no projects, please create one at <a href="app.brandwatch.com">app.brandwatch.com</a></div>',
            onItemDisclosure:true,
            itemTpl         :'<div class="list-item-title">{name}</div>' +
                             '<div class="list-item-narrative">{narrative}</div>'
        });

        //Adds the list to a panel allowing for vertical scrolling.
        this.listPanel = new Ext.Panel
        ({
            items :[this.projectList],
            scroll:'vertical',
            layout:'fit'
        });

        //Handles the on click event of a list item.
        this.projectList.on ('itemtap', function (dataview, index, item, e)
        {
            var record = dataview.getRecord (item);
            this.onProjectSelection (record);
        }, this),

        this.items = [this.listPanel];

        Brandwatch.views.LandingView.superclass.initComponent.call (this);
    },

    //Function handling the navigation of each list item via the controller.
    onProjectSelection:function (record)
    {

        var dispatchOptions =
        {
            controller:Brandwatch.controllers.controller,
            action    :'onShowProjectView'
        }

        Brandwatch.controllers.backButton.addToBackStack (dispatchOptions);

        Ext.dispatch
        ({
            controller:Brandwatch.controllers.controller,
            action    :'onProjectSelection',
            data      :record,
            historyUrl:'queries'
        });
    },

    //Function handling the search input by filtering the project ignoring casing.
    onSearchInput:function (field)
    {
        var searchTerm = field.getValue ().toLowerCase ();

        Brandwatch.stores.projectStore.filterBy (function (record)
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
        this.cancelSearchProjectsToolbar.setVisible (true);
        this.cancelSearchProjectsToolbar.setPosition (0, 0);
        this.cancelSearchProjectsToolbar.setWidth (this.getWidth ());
        this.topToolbar.hide ();
        this.searchBar.setVisible (true);
        this.searchBar.setWidth (this.getWidth ());
        this.searchBar.setHeight (40);
        this.listPanel.setPosition (0, 40);
    },

    //Function handling the way the Search toolbar is hidden.
    onSearchCancel:function ()
    {
        this.cancelSearchProjectsToolbar.hide ();
        this.topToolbar.setVisible (true);
        this.searchBar.hide ();
        this.listPanel.setPosition (0, 0);
    }
});