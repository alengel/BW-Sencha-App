//The CarouselView holds the each dashboard components in the middle and the tabcarousel navigation at the bottom.
Brandwatch.views.CarouselView = Ext.extend (Ext.TabPanel, {

    id:'summaryViewId',

    //Listeners for position of chart component.
    listeners:{
        cardswitch:function (tabpanel, newCard)
        {
            tabpanel.getDockedComponent ('sentimenttoolbar').setTitle (newCard.title);
            this.getDockedComponent ('sentimenttoolbar').getComponent ('toggleSentiment').setText ('Dashboard');
        }
    },

    //Function setting the title and backbutton of the reverse side of the chart.
    onPanelCardSwitch:function (title)
    {
        this.getDockedComponent ('sentimenttoolbar').getComponent ('toggleSentiment').setText ('back');
        this.getDockedComponent ('sentimenttoolbar').setTitle (title);
    },

    initComponent:function ()
    {
        var queryToolbar = new Brandwatch.controllers.QueryToolbar();

        //Initialization of chart components.
        var sentimentPanel = new Brandwatch.views.Sentiment ({record:this.record.data, title:'Sentiment'});
        var historyPanel = new Brandwatch.views.History ({record:this.record.data, title:'History'});
        var pageTypePanel = new Brandwatch.views.PageType ({record:this.record.data, title:'Page Types'});
        var topSitesPanel = new Brandwatch.views.TopSites ({record:this.record.data, title:'Top Sites'});
        var topTweeters = new Brandwatch.views.TopTweeters ({record:this.record.data, title:'Top Tweeters'});
        var mentionsPanel = new Brandwatch.views.Mentions ({record:this.record.data, title:'Mentions'});

        //Layout of CarouselView screen.
        Ext.apply (this,
        {
            tabBar:
            {
                dock  :'bottom',
                scroll:'horizontal',
                layout:
                {
                    pack:'center'
                }
            },

            //Toolbar toggling between chart title or selected element title.
            dockedItems:
            [
                {
                    xtype:'toolbar',
                    title:'Sentiment',
                    id   :'sentimenttoolbar',
                    cls  :'dashboardToolbar',
                    items:
                    [
                        {
                            xtype  :'button',
                            text   :'Dashboard',
                            cls    :'buttonText',
                            ui     :'back',
                            id     :'toggleSentiment',
                            handler:function ()
                            {
                                var record = Brandwatch.stores.settingsStore.findRecord ('name', 'lastQuery').get ('value');
                                if (this.getText () == 'Dashboard')
                                {
                                    Ext.dispatch
                                    ({
                                        controller:Brandwatch.controllers.controller,
                                        action    :'backToDashboard',
                                        historyUrl:'overview',
                                        data      :{data:record}
                                    });
                                }
                                else
                                {
                                    var tabPanel = Brandwatch.views.mainView.getActiveItem ();
                                    var activeTab = tabPanel.getActiveItem ();

                                    tabPanel.getDockedComponent ('sentimenttoolbar').getComponent ('toggleSentiment').setText ('Dashboard');
                                    tabPanel.getDockedComponent ('sentimenttoolbar').setTitle (activeTab.title);
                                    activeTab.showFront ();
                                }
                            }
                        }
                    ]
                },
                queryToolbar
            ],

            items:
            [
                sentimentPanel,
                historyPanel,
                pageTypePanel,
                topSitesPanel,
                topTweeters,
                mentionsPanel
            ]
        });

        //Listeners for each chart.
        sentimentPanel.addListener ('showpanelback', this.onPanelCardSwitch, this);
        historyPanel.addListener ('showpanelback', this.onPanelCardSwitch, this),
        pageTypePanel.addListener ('showpanelback', this.onPanelCardSwitch, this),
        topSitesPanel.addListener ('showpanelback', this.onPanelCardSwitch, this),
        topTweeters.addListener ('showpanelback', this.onPanelCardSwitch, this),
        mentionsPanel.addListener ('showpanelback', this.onPanelCardSwitch, this),

        Brandwatch.views.CarouselView.superclass.initComponent.apply (this);
    }
});