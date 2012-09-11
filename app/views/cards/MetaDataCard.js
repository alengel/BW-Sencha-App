//Layout of the Meta Data Card.
Brandwatch.views.MetaData = Ext.extend (Ext.Panel, {

    layout:'fit',
    id    :'metadataCard',

    initComponent:function ()
    {
        this.metadata = new Ext.Panel
            ({
                scroll: 'vertical',
                html  : '<div id="date">Found  ' + this.record.mentiondate + '</div>' +
                        '<div id="url">URL  ' + this.record.mentionurl + '</div>' +
                        '<div id="sentiment">Sentiment  ' + this.record.mentionsentiment + '</div>' +
                        '<div id="domain">Site  ' + this.record.mentiondomain + '</div>' +
                        '<div id="pagetype">Page type  ' + this.record.mentionpagetype + '</div>' +
                        '<div id="moz">mozRank ' + this.record.mentionmoz + '</div>' +
                        '<div id="location">Location ' + this.record.mentionlocation + '</div>' +
                        '<div id="language">Language ' + this.record.mentionlanguage + '</div>' +
                        '<div id="backlinks">Backlinks ' + this.record.mentionbacklinks + '</div>'
            }),

            this.items = [this.metadata];

        Brandwatch.views.MetaData.superclass.initComponent.call (this);
    }
});
