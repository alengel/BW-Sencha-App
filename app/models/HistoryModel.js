//Model structuring the HistoryStore.
Ext.regModel ('HistoryModel',
{
    fields:
    [
        {name:'date', type:'string'},
        {name:'formatteddate', type:'date'},
        {name:'mentions', type:'number'},
        {name:'negative', type:'number'},
        {name:'positive', type:'number'},
        {name:'neutral', type:'number'}
    ]
});





