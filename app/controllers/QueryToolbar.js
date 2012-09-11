//Toolbar showing the selected query's name.

function getToolBarTitle()
{
    return Brandwatch.stores.settingsStore.findRecord ('name', 'lastquery').get ('value').name;
}

Brandwatch.controllers.QueryToolbar = Ext.extend (Ext.Toolbar, {

    title:'',
    cls  :'queryNameBar',
    ui   :'light',

    initComponent:function ()
    {
        this.title = '<div class="queryName">' + getToolBarTitle() + '</div>';
    }
});