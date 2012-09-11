//Sync.js deals with the API call requests and responses.

//Some API calls on mobile came back with a preceding OK that needed to be removed manually.
function verifyResponse (response)
{
    if (response.indexOf ("OK") == 0)
    {
        return response.replace ("OK", "")
    }
    return response;
}

//API call for projects.
function syncProjects (key)
{
    Brandwatch.stores.projectStore.removeAll ();
    Ext.Ajax.request
    ({
        url    :'http://bwjsonapi.nodejitsu.com/projects',
        method :'GET',
        headers:{'x-bw-auth':key},
        success:function (e)
        {
            var json = Ext.util.JSON.decode (verifyResponse (e.responseText));

            for (var i = 0; i < json.length; i++)
            {

                var id = json[i].id;
                var name = json[i].name;
                Brandwatch.stores.projectStore.add ({'id':id, 'name':name});
            }

            Brandwatch.stores.landingStore.getById ("1").data.narrative = "Total: " + json.length;
            Brandwatch.stores.landingStore.fireEvent ('datachanged');
        },

        failure:function (e)
        {
            console.log ("failure loading projects", e);
        }
    });
}

//API call for alerts.
function syncAlerts (key)
{
    Brandwatch.stores.alertsStore.removeAll ();
    Ext.Ajax.request
    ({
        url    :'http://bwjsonapi.nodejitsu.com/alerts',
        method :'GET',
        headers:{'x-bw-auth':key},
        success:function (e)
        {
            var json = Ext.util.JSON.decode (verifyResponse (e.responseText));

            for (var i = 0; i < json.length; i++)
            {
                var id = json[i].id;
                var queryId = json[i].queryId;
                var name = json[i].name;
                var searchString = json[i].searchString;

                Brandwatch.stores.alertsStore.add ({'id':id, 'queryid':queryId, 'name':name, 'searchparams':searchString});
            }

            Brandwatch.stores.landingStore.getById ("4").data.narrative = "Total: " + json.length;
            Brandwatch.stores.landingStore.fireEvent ('datachanged');
        },

        failure:function (e)
        {
            console.log ("failure loading alerts", e);
        }
    });
}

//API call for Alert mentions.
function syncAlertMentions (key, queryId, searchString, startDate, endDate, startIndex)
{
    startIndex = typeof(startIndex) != 'undefined' ? startIndex : 0;
    var maxResults = '10';
	
	if(startIndex == 0)
	{
		Brandwatch.stores.alertsMentionsStore.removeAll ();
	}


    var params = {queryId:queryId, startDate:startDate, endDate:endDate, startIndex:startIndex, maxResults:maxResults};

    //The search string parameters come back as the correct string that needs to be send back to request the mentions but
    //Sencha does not implement the function this way. The string needs to split into it's name/value pairs and is then
    //reassembled by Sencha.
    var args = searchString.split ('&');
    for (var i = 0; i < args.length; i++)
    {
        var splitted = args[i].split ('=');
        params[splitted[0]] = splitted[1]
    }

    Ext.Ajax.request
    ({
        url    :'http://bwjsonapi.nodejitsu.com/mentions',
        method :'GET',
        headers:{'x-bw-auth':key},
        params :params,
        success:function (e)
        {
            var store = Brandwatch.stores.alertsMentionsStore;
            var json = Ext.util.JSON.decode (verifyResponse (e.responseText));
            var previewSize = 60;
            var endString = '...';
            var index = store.getCount () + 1;

            for (var i = 0; i < json.items.length; i++)
            {
                var title = json.items[i].title;
                var date = json.items[i].formatted_date;
                var snippet = json.items[i].summary;
                snippet = fixJSON (snippet);
                var shortSnippet = cleanSummary (snippet);
                shortSnippet = shortSnippet.substring (0, previewSize) + endString;
                var url = json.items[i].url;
                var sentiment = json.items[i].brandSentiment;
                var domain = json.items[i].domain;
                var pagetype = json.items[i].site_type;
                var mozRank = json.items[i].seomoz_domain_mozrank;
                var location = json.items[i].geo_location;
                var language = json.items[i].language;
                var backlinks = json.items[i].seomoz_num_backlinks;

                store.add
                ({
                    'mentionindex'        :index,
                    'mentiontitle'        :title,
                    'mentiondate'         :date,
                    'mentionsnippet'      :snippet,
                    'mentionshortsnippet' :shortSnippet,
                    'mentionurl'          :url,
                    'mentionsentiment'    :sentiment,
                    'mentiondomain'       :domain,
                    'mentionpagetype'     :pagetype,
                    'mentionmoz'          :mozRank,
                    'mentionlocation'     :location,
                    'mentionlanguage'     :language,
                    'mentionbacklinks'    :backlinks
                });

                index += 1;
            }
			
			store.fireEvent('datachanged');
        },

        failure:function (e)
        {
            console.log ("failure loading mentions", e);
        }
    });
}

//API call for queries.
function syncQueries (key, projectId)
{
    Brandwatch.stores.queryStore.removeAll ();

    Ext.Ajax.request
    ({
        url    :'http://bwjsonapi.nodejitsu.com/queries',
        method :'GET',
        headers:{'x-bw-auth':key},
        params :{projectId:projectId},
        success:function (e)
        {
            var json = Ext.util.JSON.decode (verifyResponse (e.responseText));

            for (var i = 0; i < json.length; i++)
            {
                var id = json[i].id;
                var name = json[i].name;

                Brandwatch.stores.queryStore.add ({'id':id, 'name':name});
            }
        },

        failure:function (e)
        {
            console.log ("failure loading queries", e);
        }
    });
}

//API call for dashboard components sentiment, history, page types and top sites.
function getSummary (key, queryID, startDate, endDate)
{
    if (Brandwatch.stores.filteredMentionsStore.getCount () != 0)
    {
        Brandwatch.stores.filteredMentionsStore.removeAll ();
    }

    Ext.Ajax.request
    ({
        url    :'http://bwjsonapi.nodejitsu.com/summary',
        method :'GET',
        headers:{'x-bw-auth':key},
        params :{queryId:queryID, startDate:startDate, endDate:endDate},
        success:function (e)
        {
            var json = Ext.util.JSON.decode (verifyResponse (e.responseText));

            populateSentiment (json);
            populateHistory (json);
            populatePagetypes (json);
            populateTopsites (json);
            populateMentions (key, queryID, startDate, endDate);
        },

        failure:function (e)
        {
            console.log ("failure loading dashboard components", e);
        }
    });
}

//Function filling the sentimentStore with data.
function populateSentiment (json)
{
    Brandwatch.stores.sentimentStore.removeAll ();

    var total = json.metrics.mentions;
    var negative = json.metrics.negative;
    var positive = json.metrics.positive;
    var neutral = json.metrics.neutral;

    Brandwatch.stores.sentimentStore.add ({'name':'Negative', 'value':negative});
    Brandwatch.stores.sentimentStore.add ({'name':'Positive', 'value':positive});
    Brandwatch.stores.sentimentStore.add ({'name':'Neutral', 'value':neutral});
}

//Function filling the historyStore with data.
function populateHistory (json)
{
    Brandwatch.stores.historyStore.removeAll ();

    for (var i = 0; i < json.brandData.days.length; i++)
    {
        //The date comes back in an odd format with dashes and is fixed manually.
        var fixDate = json.brandData.days[i].date.replace ("-", "/");
        fixDate = fixDate.replace ("-", "/");
        fixDate = fixDate.split ("T")[0];

        var date = new Date (fixDate);
        date = formatDate (date);
        var mentionDate = new Date (fixDate);
        var mentions = json.brandData.days[i].mentions;
        var negDay = json.brandData.days[i].negative;
        var posDay = json.brandData.days[i].positive;
        var neuDay = json.brandData.days[i].neutral;

        Brandwatch.stores.historyStore.add ({'date':date, 'formatteddate':mentionDate, 'mentions':mentions, 'negative':negDay, 'positive':posDay, 'neutral':neuDay});
    }
}

//Function filling the pagetypeStore with data.
function populatePagetypes (json)
{
    Brandwatch.stores.pagetypeStore.removeAll ();

    //var name = json.siteTypes;
    var blog = json.siteTypes.blog;
    var forum = json.siteTypes.forum;
    var general = json.siteTypes.general;
    var news = json.siteTypes.news;
    var twitter = json.siteTypes.twitter;
    var video = json.siteTypes.video;

    Brandwatch.stores.pagetypeStore.add ({'name':'Blog', 'value':blog});
    Brandwatch.stores.pagetypeStore.add ({'name':'Forum', 'value':forum});
    Brandwatch.stores.pagetypeStore.add ({'name':'General', 'value':general});
    Brandwatch.stores.pagetypeStore.add ({'name':'News', 'value':news});
    Brandwatch.stores.pagetypeStore.add ({'name':'Twitter', 'value':twitter});
    Brandwatch.stores.pagetypeStore.add ({'name':'Video', 'value':video});
}

//Function filling the topsitesStore with data.
function populateTopsites (json)
{
    Brandwatch.stores.topsitesStore.removeAll ();

    for (var i = 0; i < json.topDomains.length; i++)
    {
        var siteName = json.topDomains[i].name;
        var siteVolume = json.topDomains[i].volume;

        Brandwatch.stores.topsitesStore.add ({'sitename':siteName, 'sitevolume':siteVolume});
    }
}

//API call for mentions and function saves the data to the mentionsStore.
function populateMentions (key, queryID, startDate, endDate, store, sentiment, pagetype, site, startIndex)
{
    //If any of the parameters for the API call are missing, they are replaced with empty stings.
    sentiment = typeof(sentiment) != 'undefined' ? sentiment : '';
    pagetype = typeof(pagetype) != 'undefined' ? pagetype : '';
    site = typeof(site) != 'undefined' ? site : '';
    store = typeof(store) != 'undefined' ? store : Brandwatch.stores.mentionsStore;
    startIndex = typeof(startIndex) != 'undefined' ? startIndex : 0;

    if (startIndex == 0)
    {
        store.removeAll ();
    }

    //Actual API call.
    Ext.Ajax.request
    ({
        url    :'http://bwjsonapi.nodejitsu.com/mentions',
        method :'GET',
        headers:{'x-bw-auth':key},
        params :{queryId:queryID, startDate:startDate, endDate:endDate, startIndex:startIndex, maxResults:'10', sentiment:sentiment, siteType:pagetype, site:site},
        success:function (e)
        {
            var json = Ext.util.JSON.decode (verifyResponse (e.responseText));
            var previewSize = 60;
            var endString = '...';
            var index = store.getCount () + 1;

            for (var i = 0; i < json.items.length; i++)
            {
                var title = json.items[i].title;
                var date = json.items[i].formatted_date;
                var snippet = json.items[i].summary;
                snippet = fixJSON (snippet);
                var shortSnippet = cleanSummary (snippet);
                shortSnippet = shortSnippet.substring (0, previewSize) + endString;
                var url = json.items[i].url;
                var sentiment = json.items[i].brandSentiment;
                var domain = json.items[i].domain;
                var pagetype = json.items[i].site_type;
                var mozRank = json.items[i].seomoz_domain_mozrank;
                var location = json.items[i].geo_location;
                var language = json.items[i].language;
                var backlinks = json.items[i].seomoz_num_backlinks;

                store.add
                ({
                    'mentionindex'        :index,
                    'mentiontitle'        :title,
                    'mentiondate'         :date,
                    'mentionsnippet'      :snippet,
                    'mentionshortsnippet' :shortSnippet,
                    'mentionurl'          :url,
                    'mentionsentiment'    :sentiment,
                    'mentiondomain'       :domain,
                    'mentionpagetype'     :pagetype,
                    'mentionmoz'          :mozRank,
                    'mentionlocation'     :location,
                    'mentionlanguage'     :language,
                    'mentionbacklinks'    :backlinks
                });

                index += 1;
            }
			
			store.fireEvent('datachanged');
        },

        failure:function (e)
        {
            console.log ("failure loading mentions", e);
        }
    });
}

//Function to check if the summary returned contains any content.
function fixJSON (summary)
{
    if (typeof summary != 'string')
    {
        summary = "There is no summary to display.";
    }
    return summary;
}

//Function to strip the returned summary of HTML brackets.
function cleanSummary (summary)
{
    var fixSummary = summary.replace (/<span class='matchedTerm'>/g, "");
    fixSummary = fixSummary.replace (/<\/span>/g, "");
    fixSummary = fixSummary.replace (/<wbr \/>/g, "");
    return fixSummary;
}