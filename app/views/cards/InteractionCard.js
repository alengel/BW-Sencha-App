//Layout of the Single Mention Card including the workflow and engagement overlay.
Brandwatch.views.Interaction = Ext.extend (Ext.Panel, {

    layout:'fit',

    initComponent:function ()
    {
        var lastQuery = Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery');

        var toolbarTop = new Ext.Toolbar
        ({
            dock:'top'
        });

        //Overlay containing the dummy engagement components.
        var engagementPanel = new Ext.Panel
        ({
            floating        :true,
            modal           :true,
            centered        :false,
            width           :Ext.is.Phone ? 260 : 400,
            height          :Ext.is.Phone ? 220 : 400,
            styleHtmlContent:true,
            dockedItems     :toolbarTop,
            scroll          :'vertical',
            html            :'<img src="lib/resources/images/engagement.png"/>',
            cls             :'htmlcontent'
        });

        //Dropdown list containing the dummy assignment components, part of workflow.
        var assignmentList = new Ext.form.Select
        ({
            label  :'Assignment',
            border :'3 3 3 3',
            options:
            [
                {text:'giles@brandwatch.com', value:'first'},
                {text:'alena@brandwatch.com', value:'second'},
                {text:'katja@brandwatch.com', value:'third'}
            ]
        });

        //Dropdown list containing the dummy priority components, part of workflow.
        var priorityList = new Ext.form.Select
        ({
            label  :'Priority',
            border :'3 3 3 3',
            options:
            [
                {text:'high', value:'first'},
                {text:'medium', value:'second'},
                {text:'low', value:'third'}
            ]
        });

        //Dropdown list containing the dummy status components, part of workflow.
        var statusList = new Ext.form.Select
        ({
            label  :'Status',
            border :'3 3 3 3',
            options:
            [
                {text:'open', value:'first'},
                {text:'pending', value:'second'},
                {text:'closed', value:'third'}
            ]
        });

        //Overlay containing the dummy workflow components.
        var workflowPanel = new Ext.Panel
        ({
            floating        :true,
            modal           :true,
            centered        :false,
            width           :Ext.is.Phone ? 260 : 400,
            height          :Ext.is.Phone ? 220 : 400,
            styleHtmlContent:true,
            dockedItems     :toolbarTop,
            scroll          :'vertical',
            cls             :'htmlcontent',
            items           :
            [
                assignmentList,
                priorityList,
                statusList
            ]
        });

        //Function showing the engagement overlay.
        this.showEngagement = function (btn, event)
        {
            engagementPanel.setCentered (true);
            toolbarTop.setTitle ('Engagement');
            engagementPanel.show ();
        };

        //Function showing the workflow overlay.
        this.showWorkflow = function (btn, event)
        {
            workflowPanel.setCentered (true);
            toolbarTop.setTitle ('Workflow');
            workflowPanel.show ();
        };

        this.engageButton = new Ext.Button
        ({
            iconCls :'shuffle',
            iconMask:true,
            scope   :this
        });

        this.workflowButton = new Ext.Button
        ({
            iconCls :'bubble',
            iconMask:true,
            handler :function ()
            {
                Ext.dispatch
                ({
                    controller:Brandwatch.controllers.controller
                });
            },
            scope   :this
        });

        this.queryToolbar = new Brandwatch.controllers.QueryToolbar({"toolBarTitle" : this.record.name});

        this.tabBar = new Ext.TabBar
        ({
            ui    :'dark',
            dock  :'bottom',
            layout:
            {
                pack:'center'
            },
            items :
            [
                {
                    text   :'Engagement',
                    iconCls:'contract',
                    handler:this.showEngagement
                },
                {
                    text   :'Workflow',
                    iconCls:'nodes1',
                    handler:this.showWorkflow
                }
            ]
        });

        var cardHolder = this;

        //Layout of Mentions List.
        var singleMentionCard = new Ext.Panel
        ({
            id    :'singleMentionTab',
            scroll:'vertical',
            html  :'<div id="top"> <div id="date">' + this.record.mentiondate + '</div> <div id="title">' +
                    this.record.mentiontitle + '</div> <div id="url">' + this.record.mentionurl +
                    '</div></div> <div id="main">' + this.record.mentionsnippet + '</div>'
        });

        
        var metaDataCard = new Brandwatch.views.MetaData ({record:this.record});

        Ext.apply (this,
        {
            layout     :'card',
            dockedItems:
            [
                {
                    xtype:'toolbar',
                    title:'Interaction',
                    id   :'metatoolbar',
                    cls  :'dashboardToolbar',
                    items:
                    [
                        Brandwatch.controllers.backButton,
                        {xtype:'spacer'},
                        {
                            xtype   :'button',
                            id      :'infoBtn',
                            iconCls :'info',
                            iconMask:true,
                            ui      :'plain',
                            handler :function ()
                            {
                                cardHolder.showOtherSide ();
                            }

                        }
                    ]
                },
                this.queryToolbar,
                this.tabBar
            ],
            items      :[singleMentionCard, metaDataCard]
        });

        Brandwatch.views.Interaction.superclass.initComponent.call (this);
    },

    //Function making the Meta Data card the active item in the Application.
    showOtherSide:function (item)
    {
        if (this.getDockedComponent('metatoolbar').title == 'Interaction')
        {
            this.setActiveItem ('metadataCard');
            this.getDockedComponent ('metatoolbar').setTitle ('Info');
        }
        else
        {
            this.setActiveItem ('singleMentionTab');
            this.getDockedComponent ('metatoolbar').setTitle ('Interaction');
        }
    }
});