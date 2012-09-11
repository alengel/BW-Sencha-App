//Layout of the component that shows mentions filtered by the user's choice on the back of each dashboard component.
Brandwatch.views.FilteredMentions = Ext.extend (Ext.Panel, {

    layout:'fit',

    initComponent:function ()
    {
        //Layout of the mentions list filled with data from the filteredMentionsStore.
        this.sitesList = new Ext.List
            ({
                scroll          :'vertical',
                store           :Brandwatch.stores.filteredMentionsStore,
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

        Brandwatch.views.FilteredMentions.superclass.initComponent.call (this);
    },

    //Function handling the navigation of each list item via the controller.
    onMentionSelection:function (record)
    {
        var dispatchOptions =
        {
            controller:Brandwatch.controllers.controller,
            action    :'showview',
            data      :{ view:Brandwatch.views.mainView.getActiveItem () }
        };

        Brandwatch.controllers.backButton.addToBackStack (dispatchOptions);

        Ext.dispatch
        ({
            controller:Brandwatch.controllers.controller,
            action    :'onMentionSelection',
            data      :record
        });
    }
});
