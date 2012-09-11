//Layout of the History Chart and the filtered mentions back.
Brandwatch.views.History = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'fit',
    iconCls   :'history',

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

        //Layout of the History Line Chart.
        var imageCard = new Ext.chart.Chart (
        {
            cls       :'line1',
            id        :'historyTab',
            store     :Brandwatch.stores.historyStore,
            background:
            {
                fill:'#f7f7f7'
            },
            animate   :false,

            legend:
            {
                dock    :false,
                position:
                {
                    landscape:'right',
                    portrait :'bottom'
                }
            },
            axes  :
            [
                {
                    type          :'Numeric',
                    position      :'left',
                    fields        :['mentions', 'negative', 'positive', 'neutral'],
                    minorTickSteps:1
                },
                {
                    type    :'Category',
                    position:'bottom',
                    fields  :['date']
                }
            ],
            series:
            [
                {
                    type     :'line',
                    listeners:
                    {
                        //Function handling the click event.
                        'itemtap':function (line, item, event)
                        {
                            var historyDate = item.storeItem.get ('formatteddate');
                            var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
                            var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id

                            populateMentions (key, queryID, historyDate, historyDate.add (Date.MINUTE, 1439), Brandwatch.stores.filteredMentionsStore)

                            chartHolder.showBack (item, 'mentions');
                        }
                    },
                    highlight:
                    {
                        size  :7,
                        radius:7
                    },
                    smooth   :true,
                    axis     :'left',
                    xField   :'date',
                    yField   :'mentions',
                    title    :'Total'
                },
                {
                    type     :'line',
                    listeners:
                    {
                        'itemtap':function (line, item, event)
                        {
                            var historyDate = item.storeItem.get ('formatteddate');
                            var selectedSentiment = 'negative';

                            var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
                            var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id;

                            populateMentions (key, queryID, historyDate, historyDate.add (Date.MINUTE, 1439), Brandwatch.stores.filteredMentionsStore, selectedSentiment)

                            chartHolder.showBack (item, selectedSentiment);
                        }
                    },
                    highlight:
                    {
                        size  :7,
                        radius:7
                    },
                    smooth   :true,
                    axis     :'left',
                    xField   :'date',
                    yField   :'negative',
                    title    :'Negative'
                },
                {
                    type     :'line',
                    listeners:
                    {
                        'itemtap':function (line, item, event)
                        {
                            var historyDate = item.storeItem.get ('formatteddate');
                            var selectedSentiment = 'positive';

                            var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
                            var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id;

                            populateMentions (key, queryID, historyDate, historyDate, Brandwatch.stores.filteredMentionsStore, selectedSentiment)

                            chartHolder.showBack (item, selectedSentiment);
                        }
                    },
                    highlight:
                    {
                        size  :7,
                        radius:7
                    },
                    axis     :'left',
                    smooth   :true,
                    xField   :'date',
                    yField   :'positive',
                    title    :'Positive'
                },
                {
                    type     :'line',
                    listeners:
                    {
                        'itemtap':function (line, item, event)
                        {
                            var historyDate = item.storeItem.get ('formatteddate');
                            var selectedSentiment = 'neutral';

                            var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
                            var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id;

                            populateMentions (key, queryID, historyDate, historyDate, Brandwatch.stores.filteredMentionsStore, selectedSentiment)

                            chartHolder.showBack (item, selectedSentiment);
                        }
                    },
                    highlight:
                    {
                        size  :7,
                        radius:7
                    },
                    axis     :'left',
                    smooth   :true,
                    xField   :'date',
                    yField   :'neutral',
                    title    :'Neutral'
                }
            ]
        });

        //Reverse of the history chart showing the filtered mentions.
        var mentionsCard = new Brandwatch.views.FilteredMentions ({id:'filteredMentionsHistory', location:'toHistory'});

        Ext.apply (this,
        {
            layout             :'card',
            cardSwitchAnimation:'flip',
            items              :[imageCard, mentionsCard]
        });

        Brandwatch.views.History.superclass.initComponent.apply (this);
    },

    //Function making the History Chart the active item in the Application.
    showFront:function ()
    {
        this.setActiveItem ('historyTab');
    },

    //Function making the History Filtered Mentions the active item in the Application.
    showBack:function (item, selectedSentiment)
    {
        var date = item.storeItem.get ('date');
        date = date.replace (', 2012', '');
        var value = '';
        var sentiment = selectedSentiment;

        if (sentiment == "neutral")
        {
            value = item.storeItem.get ('neutral');
        }
        else if (sentiment == "positive")
        {
            value = item.storeItem.get ('positive');
        }
        else if (sentiment == "negative")
        {
            value = item.storeItem.get ('negative');
        }
        else
        {
            value = item.storeItem.get ('mentions');
        }

        var title = value + ' ' + sentiment + ' on ' + date;

        this.setActiveItem ('filteredMentionsHistory');

        this.fireEvent ('showpanelback', title);
    }
});