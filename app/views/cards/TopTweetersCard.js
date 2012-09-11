//Dummy Layout for the Top Tweeters List Component. Placeholder until the Top Tweeters API call is implemented.
Brandwatch.views.TopTweeters = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'fit',
    iconCls   :'toptweeters',

    //Function clearing the filtered mentions and showing the unfiltered list.
    listeners:
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

        //Layout of the Top Tweeters List.
        var imageCard = new Ext.List (
        {
            id          :'toptweetersTab',
            store       :Brandwatch.stores.topsitesStore,
            emptyText   :'<div style="margin:5px;">No sites cached.</div>',
            singleSelect:true,
            itemTpl     :'<div class="list-item-title">{sitename} <div class="list-item-volume">{sitevolume}</div> </div>',
            listeners   :
            {
                //Function handling the click event.
                'itemtap':function (dataview, index, item, e)
                {
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
        var mentionsCard = new Brandwatch.views.FilteredMentions ({id:'filteredMentionsToptweeters', location:'toToptweeters'});

        Ext.apply (this,
        {
            layout             :'card',
            cardSwitchAnimation:'flip',
            items              :[imageCard, mentionsCard]

        });
        Brandwatch.views.TopTweeters.superclass.initComponent.apply (this);
    },

    //Function making the Top Tweeters List the active item in the Application.
    showFront:function ()
    {
        this.setActiveItem ('toptweetersTab');
    },

    //Function making the Top Tweeters Filtered Mentions the active item in the Application.
    showBack:function (item)
    {
        var value = item.data.sitevolume;
        var title = value + ' on ' + item.data.sitename;

        this.setActiveItem ('filteredMentionsToptweeters');

        this.fireEvent ('showpanelback', title);
    }
});