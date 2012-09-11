//Model structuring the ProjectsStore.
Ext.regModel ('ProjectModel',
{
    fields     :
    [
        { name:'id', type:'int' },
        { name:'name', type:'string' }
    ],
    validations:
    [
        { type:'presence', field:'id' },
        { type:'presence', field:'name' }
    ]
});