//Model structuring the MentionsStore, AlertsMentionsStore and FilteredMentionsStore.
Ext.regModel ('MentionsModel',
{
    fields:
    [
        {name:'mentionindex', type:'string'},
        {name:'mentiontitle', type:'string'},
        {name:'mentiondate', type:'string'},
        {name:'mentionsnippet', type:'string'},
        {name:'mentionshortsnippet', type:'string'},
        {name:'mentionurl', type:'string'},
        {name:'mentionsentiment', type:'string'},
        {name:'mentiondomain', type:'string'},
        {name:'mentionpagetype', type:'string'},
        {name:'mentionmoz', type:'string'},
        {name:'mentionlocation', type:'string'},
        {name:'mentionlanguage', type:'string'},
        {name:'mentionbacklinks', type:'string'}
    ]
});





