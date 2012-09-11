//Layout of the Mentions List.
Brandwatch.views.Mentions = Ext.extend (Ext.Panel, {

    id        :'mentionsTab',
    iconCls   :'mentions',
    fullscreen:true,
    layout    :'fit',

    //Function clearing the filtered mentions and showing the unfiltered list.
    listeners :
    {
        'show':function (mentionView)
        {
            Brandwatch.stores.mentionsStore.clearFilter (false);
        }
    },

    initComponent:function ()
    {
        //Layout of the mentions list filled with data from the mentionsStore.
        this.sitesList = new Ext.List (
        {
            scroll          :'vertical',
            store           :Brandwatch.stores.mentionsStore,
            emptyText       :'<div style="margin:5px;">No mentions cached.</div>',
            onItemDisclosure:true,
            plugins         :
            [
                {
                    ptype     :'listpaging',
					pageSize: 10,
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

        Brandwatch.views.Mentions.superclass.initComponent.call (this);
    },

    //Function handling the navigation of each list item via the controller.
    onMentionSelection:function (record)
    {
        var dispatchOptions =
        {
            controller:Brandwatch.controllers.controller,
            action    :'toMentions'
        };

        Brandwatch.controllers.backButton.addToBackStack (dispatchOptions);

        Ext.dispatch
        ({
            controller:Brandwatch.controllers.controller,
            action    :'onMentionSelection',
            url       :'single',
            data      :record
        });
    }
});
