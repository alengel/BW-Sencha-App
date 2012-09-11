//Stores the data for the sentiment chart.
Ext.regStore ('SentimentStore', {
    model:'SentimentModel'
});

Brandwatch.stores.sentimentStore = Ext.StoreMgr.get ('SentimentStore');