//The DashboardView gives access to the different components and calendar.
Brandwatch.views.DashboardView = Ext.extend (Ext.Panel, {

    layout:'fit',

    initComponent:function ()
    {
        this.sentimentButton = new Ext.Button
        ({
            record :this.record,
            html   :'<img src="lib/resources/images/sentiment.png"/>',
            id     :'sentiment-button',
            handler:function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'toSentiment',
                    data      :this.record,
                    historyUrl:'sentiment'
                });
            }
        });

        this.historyButton = new Ext.Button
        ({
            record :this.record,
            html   :'<img src="lib/resources/images/history.png"/>',
            id     :'history-button',
            handler:function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'toHistory',
                    data      :this.record,
                    historyUrl:'history'
                });
            }
        });

        this.pagetypeButton = new Ext.Button
        ({
            record :this.record,
            html   :'<img src="lib/resources/images/pagetype.png"/>',
            id     :'pagetype-button',
            handler:function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'toPagetype',
                    data      :this.record,
                    historyUrl:'pagetype'
                });
            }
        });

        this.topsitesButton = new Ext.Button
        ({
            record :this.record,
            html   :'<img src="lib/resources/images/topsites.png"/>',
            id     :'topsites-button',
            handler:function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'toTopsites',
                    data      :this.record,
                    historyUrl:'topsites'
                });
            }
        });

        this.toptweetersButton = new Ext.Button
        ({
            record :this.record,
            cls    :'toptweeters-button',
            html   :'<img src="lib/resources/images/toptweeters.png"/>',
            id     :'toptweeters-button',
            handler:function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'toToptweeters',
                    data      :this.record,
                    historyUrl:'toptweeters'
                });
            }
        });

        this.mentionsButton = new Ext.Button
        ({
            record :this.record,
            html   :'<img src="lib/resources/images/mentions.png"/>',
            id     :'mentions-button',
            handler:function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'toMentions',
                    data      :this.record,
                    historyUrl:'mentions'
                });
            }
        });

        //Button to open the calendar screen.
        this.dateButton = new Ext.Button
        ({
            record  :this.record,
            iconCls :'calendar',
            iconMask:true,
            ui      :'plain',
            handler :function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller,
                    action    :'openCalendar',
                    data      :this.record,
                    historyUrl:'dates'
                });
            }
        });

        this.backButton = Brandwatch.controllers.backButton;

        this.topToolbar = new Ext.Toolbar
        ({
            title:'Dashboard',
            items:
            [
                this.backButton,
                {xtype:'spacer'},
                this.dateButton
            ]
        });

        this.queryToolbar = new Brandwatch.controllers.QueryToolbar();

        this.dockedItems = [this.topToolbar, this.queryToolbar];

        //Panel structuring the components buttons.
        this.dashboardPanel = new Ext.Panel
        ({
            cls   :'buttonWrap',
            scroll:'vertical',
            layout:
            {
                type :'vbox',
                align:'center'
            },
            items :
            [
                {
                    xtype :'panel',
                    layout:'hbox',
                    align :'center',
                    items :
                    [
                        this.sentimentButton,
                        this.historyButton
                    ]
                },
                {
                    xtype :'panel',
                    layout:'hbox',
                    align :'center',
                    items :
                    [
                        this.pagetypeButton,
                        this.topsitesButton
                    ]
                },
                {
                    xtype :'panel',
                    layout:'hbox',
                    align :'center',
                    items :
                    [
                        this.toptweetersButton,
                        this.mentionsButton
                    ]
                }
            ]
        });

        this.items = [this.dashboardPanel];

        Brandwatch.views.QueryView.superclass.initComponent.call (this);
    }
});