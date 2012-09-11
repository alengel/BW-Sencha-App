//Model structuring the AlertsStore.
Ext.regModel ('AlertsModel',
{
    fields     :
    [
        { name:'id', type:'int' },
        { name:'queryid', type:'int' },
        { name:'name', type:'string' },
        { name:'searchparams', type:'string' }
    ],
    validations:
    [
        { type:'presence', field:'id' },
        { type:'presence', field:'name' }
    ]
});