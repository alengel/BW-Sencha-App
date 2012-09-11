//Layout of the Top Sites List Card and the filtered mentions back.
Brandwatch.views.TopSites = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'fit',
    iconCls   :'topsites',

    //Function clearing the filtered mentions and showing the unfiltered list.
    listeners :
    {
        'show':function (mentionView)
        {
            Brandwatch.stores.filteredMentionsStore.clearFilter (false);
            this.showFront ();
        }
    },

    initComponent:function ()
    {
        var chartHolder = this;

        //Layout of the Top Sites List.
        var componentCard = new Ext.List (
        {
            id          :'topsitesTab',
            store       :Brandwatch.stores.topsitesStore,
            emptyText   :'<div style="margin:5px;">No sites cached.</div>',
            singleSelect:true,
            itemTpl     :'<div class="list-item-title">{sitename} <div class="list-item-volume">{sitevolume}</div> </div>',
            listeners   :
            {
                'itemtap':function (dataview, index, item, e)
                {
                    //Function handling the click event.
                    var site = dataview.getRecord (item).get ('sitename').toLowerCase ();
                    var pagetype = '';
                    var sentiment = '';
                    var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
                    var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id;
                    var startDate = Brandwatch.stores.settingsStore.findRecord ('name', 'startDate').get ('value');
                    var endDate = Brandwatch.stores.settingsStore.findRecord ('name', 'endDate').get ('value');

                    populateMentions (key, queryID, startDate, endDate, Brandwatch.stores.filteredMentionsStore, sentiment, pagetype, site);
                    chartHolder.showBack (dataview.getRecord (item));
                }
            }
        });

        //Reverse of the Top Sites list showing the filtered mentions.
        var mentionsCard = new Brandwatch.views.FilteredMentions ({id:'filteredMentionsTopsites', location:'toTopsites'});

        Ext.apply (this,
        {
            layout             :'card',
            cardSwitchAnimation:'flip',
            items              :[componentCard, mentionsCard]
        });
        Brandwatch.views.TopSites.superclass.initComponent.apply (this);
    },

    //Function making the Top Sites List the active item in the Application.
    showFront:function ()
    {
        this.setActiveItem ('topsitesTab');
    },

    //Function making the Top Sites Filtered Mentions the active item in the Application.
    showBack:function (item)
    {
        var value = item.data.sitevolume;
        var title = value + ' on ' + item.data.sitename;

        this.setActiveItem ('filteredMentionsTopsites');

        this.fireEvent ('showpanelback', title);
    }
});