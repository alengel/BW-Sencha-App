//Layout of the Page Types Chart and the filtered mentions back.
Brandwatch.views.PageType = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'fit',
    iconCls   :'pagetype',

    //Function clearing the filtered mentions and showing the chart.
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

        //Layout of the Page Tpye Column Chart.
        var imageCard = new Ext.chart.Chart (
            {
                id        :'pagetypeTab',
                store     :Brandwatch.stores.pagetypeStore,
                background:
                {
                    fill:'#f7f7f7'
                },
                shadow    :false,
                axes  :
                [
                    {
                        type    :'Category',
                        position:'bottom',
                        fields  :['name']
                    },
                    {
                        type    :'Numeric',
                        position:'left',
                        fields  :['value']
                    }
                ],
                series:
                [
                    {
                        type        :'column',
                        label       :
                        {
                            display      :'outside',
                            'text-anchor':'middle',
                            field        :'value',
                            contrast     :true
                        },
                        xField      :'name',
                        yField      :['value'],
                        axis        :'bottom',
                        highlight   :true,
                        showInLegend:true,
                        listeners   :
                        {
                            //Function handling the click event.
                            'itemtap':function (bar, item, event)
                            {
                                var pagetype = item.storeItem.get ('name').toLowerCase ();
                                var sentiment = '';
                                var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
                                var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id;
                                var startDate = Brandwatch.stores.settingsStore.findRecord ('name', 'startDate').get ('value');
                                var endDate = Brandwatch.stores.settingsStore.findRecord ('name', 'endDate').get ('value');

                                populateMentions (key, queryID, startDate, endDate, Brandwatch.stores.filteredMentionsStore, sentiment, pagetype)

                                chartHolder.showBack (item);
                            }
                        }
                    }
                ]

            });

        //Reverse of the page type chart showing the filtered mentions.
        var mentionsCard = new Brandwatch.views.FilteredMentions ({id:'filteredMentionsPagetype', location:'toPagetype'});

        Ext.apply (this,
        {
            layout             :'card',
            cardSwitchAnimation:'flip',
            items              :[imageCard, mentionsCard]
        });
        Brandwatch.views.PageType.superclass.initComponent.apply (this);
    },

    //Function making the Page Type Chart the active item in the Application.
    showFront:function ()
    {
        this.setActiveItem ('pagetypeTab');
    },

    //Function making the Page Type Filtered Mentions the active item in the Application.
    showBack:function (item)
    {
        var value = item.storeItem.get ('value');
        var name = item.storeItem.get ('name');
        var title = name + ': ' + value;

        this.setActiveItem ('filteredMentionsPagetype');

        this.fireEvent ('showpanelback', title);
    }
});