//Layout of the sentiment pie chart and the filtered mentions back.
Brandwatch.views.Sentiment = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'fit',
    iconCls   :'sentiment',

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
        var chartLabelRenderer = function (objTmpStore, strTmpFieldName1, tmpVal, strTmpFieldName2)
        {
            var objDispVal = '';
            var strDispVal = 0;
            var intIdx = objTmpStore.findExact (strTmpFieldName1, tmpVal);
            if (intIdx != -1)
            {
                objDispVal = objTmpStore.getAt (intIdx);
                strDispVal = objDispVal.get (strTmpFieldName2);
            }
            return strDispVal;
        };

        var chartHolder = this;

        //Layout of the Sentiment Pie Chart.
        var imageCard = new Ext.chart.Chart (
        {
            cls         :'pie',
            id          :'sentimentTab',
            theme       :'Demo',
            store       :Brandwatch.stores.sentimentStore,
            background  :
            {
                fill:'#f7f7f7'
            },
            shadow      :false,
            animate     :true,
            insetPadding:10,
            legend      :
            {
                dock    :false,
                position:
                {
                    landscape:'right',
                    portrait :'bottom'
                }
            },

            interactions:
            [
                {
                    type:'piegrouping'
                }
            ],

            series:
            [
                {
                    type        :'pie',
                    field       :'name',
                    angleField  :'value',
                    showInLegend:true,
                    donut       :'25',
                    highlight   :false,
                    colorSet    :['#CA272D', '#69BF2F', '#AAA'],
                    listeners   :
                    {
                        'labelOverflow':function (label, item)
                        {
                            item.useCallout = true;
                        },

                        //Function handling the click event.
                        'itemtap'      :function (pie, item)
                        {
                            var sentiment = item.storeItem.get ('name').toLowerCase ();
                            var key = Brandwatch.stores.settingsStore.findRecord ('name', 'key').get ('value');
                            var queryID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').id;
                            var projectID = Brandwatch.stores.settingsStore.findRecord ('name', 'lastproject').get ('value').id;
                            var startDate = Brandwatch.stores.settingsStore.findRecord ('name', 'startDate').get ('value');
                            var endDate = Brandwatch.stores.settingsStore.findRecord ('name', 'endDate').get ('value');

                            populateMentions (key, queryID, startDate, endDate, Brandwatch.stores.filteredMentionsStore, sentiment)

                            chartHolder.showBack (item);
                        }
                    },

                    // Example to return as soon as styling arrives for callouts
                    callouts    :
                    {
                        renderer:function (callout, storeItem)
                        {
                            callout.label.setAttributes
                            ({
                                text:storeItem.get ('name')
                            }, true);
                        },
                        filter  :function ()
                        {
                            return false;
                        },
                        lines   :
                        {
                            'stroke-width':2,
                            offsetFromViz :20
                        },
                        label   :
                        {
                            font:'italic 14px Arial'
                        },
                        styles  :
                        {
                            font:'14px Arial'
                        }
                    },
                    label       :
                    {
                        display      :'rotate',
                        'text-anchor':'middle',
                        contrast     :true,
                        field        :'name',
                        renderer     :function (v)
                        {
                            return chartLabelRenderer (Brandwatch.stores.sentimentStore, 'name', v, 'value');
                        }
                    }
                }
            ]
        });

        //Reverse of the sentiment chart showing the filtered mentions.
        var mentionsCard = new Brandwatch.views.FilteredMentions ({id:'filteredMentionsSentiment', location:'toSentiment'});


        Ext.apply (this,
        {
            layout             :'card',
            cardSwitchAnimation:'flip',
            items              :[imageCard, mentionsCard]
        });
        Brandwatch.views.Sentiment.superclass.initComponent.apply (this);
    },

    //Function making the Sentiment Chart the active item in the Application.
    showFront:function ()
    {
        this.setActiveItem ('sentimentTab');
    },

    //Function making the Sentiment Filtered Mentions the active item in the Application.
    showBack:function (item)
    {
        var value = item.storeItem.get ('value');
        var name = item.storeItem.get ('name');
        var title = name + ': ' + value;

        this.setActiveItem ('filteredMentionsSentiment');
        this.fireEvent ('showpanelback', title);
    }
});