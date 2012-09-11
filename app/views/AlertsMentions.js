//Layout of the Alerts Mentions Card.
Brandwatch.views.AlertsMentions = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'fit',

    //Function clearing the filtered mentions and showing the unfiltered list.
    listeners :
    {
        'show':function (mentionView)
        {
            Brandwatch.stores.alertsMentionsStore.clearFilter (false);
        }
    },

    initComponent:function ()
    {
        var lastQuery = Brandwatch.stores.settingsStore.findRecord ('name', 'lastalert');

        this.topToolbar = new Ext.Toolbar
        ({
            title:'Mentions',
            cls  :'dashboardToolbar',
            items:
            [
                Brandwatch.controllers.backButton
            ]
        });

        var queryToolbar = new Ext.Toolbar
        ({
            title:'<div class="queryName">' + lastQuery.get ('value').name + '</div>',
            cls  :'queryNameBar',
            ui   :'light'
        });

        this.dockedItems = [this.topToolbar, queryToolbar];

        //Layout of the alert mentions list filled with data from the alertMentionsStore.
        this.sitesList = new Ext.List
        ({
            scroll          :'vertical',
            store           :Brandwatch.stores.alertsMentionsStore,
            emptyText       :'<div style="margin:5px;">No mentions cached.</div>',
            onItemDisclosure:true,
            plugins         :
            [
                {
                    ptype     :'listpaging',
                    autoPaging:false
                }
            ],
            itemTpl         :'<div class="list-item-title">{mentionindex}. {mentiontitle}</div>' +
                             '<div class="list-item-narrative">{mentionshortsnippet}</div>'
        });

        //Function handling the click event.
        this.sitesList.on ('itemtap', function (dataview, index, item, e)
        {
            var record = dataview.getRecord (item);
            this.onMentionSelection (record);
        },  this),

            this.items = [this.sitesList];

        Brandwatch.views.AlertsMentions.superclass.initComponent.call (this);
    },

    //Function handling the navigation of each list item via the controller.
    onMentionSelection:function (selectedRecord)
    {
        var dispatchOptions =
        {
            controller:Brandwatch.controllers.controller,
            action    :'onAlertSelection',
            data      :{ data:this.record }
        };

        Brandwatch.controllers.backButton.addToBackStack (dispatchOptions);

        Ext.dispatch
        ({
            controller:Brandwatch.controllers.controller,
            action    :'onMentionSelection',
            data      :selectedRecord
        });
    }
});
