//Model structuring the SettingsStore.
Ext.regModel ('SettingsModel',
{
    fields:
    [
        {name:'id', type:'integer'},
        {name:'name', type:'string'},
        {name:'value', type:'object'},
    ],
    proxy :
    {
        type:'localstorage',
        id  :'my-proxy'
    }
});





