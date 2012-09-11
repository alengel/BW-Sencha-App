//Function setting the correct component in the carousel.
function setTabPanel (index, record)
{
    if (summaryView == null)
    {
        summaryView = new Brandwatch.views.CarouselView ({record:record});
    }

    summaryView.tabBar.onTabTap (summaryView.tabBar.getComponent (index));

    Brandwatch.views.mainView.setActiveItem (summaryView);
}

//Function updating the second line values on the LandingView screen for last query/project.
function setLandingPanel ()
{
    var lastProject = Brandwatch.stores.settingsStore.findRecord ('name', 'lastproject');
    var lastQuery = Brandwatch.stores.settingsStore.findRecord ('name', 'lastQuery');

    if (lastProject != null)
    {
        Brandwatch.stores.landingStore.getById ("2").data.narrative = lastProject.get ('value').name;
    }
    else
    {
        Brandwatch.stores.landingStore.getById ("2").data.narrative = 'No last project yet.'
    }

    if (lastQuery != null)
    {
        Brandwatch.stores.landingStore.getById ("3").data.narrative = lastQuery.get ('value').name;
    }
    else
    {
        Brandwatch.stores.landingStore.getById ("3").data.narrative = 'No last query yet.'
    }
}

//Function checking the user logged in is the same as last user and retrieves the stored settings from local storage.
function checkUser (email)
{
    var userEmail = Brandwatch.stores.settingsStore.findRecord ('name', 'userEmail');

    if (userEmail != null)
    {
        var currentUser = userEmail.get ('value');
        var newUser = email;

        if (currentUser != newUser)
        {
            lastProject = Brandwatch.stores.settingsStore.findRecord ('name', 'lastproject');
            lastQuery = Brandwatch.stores.settingsStore.findRecord ('name', 'lastQuery');
            Brandwatch.stores.settingsStore.remove (lastProject);
            Brandwatch.stores.settingsStore.remove (lastQuery);
        }
    }
}

//Function adding/updating records to local storage.
function updateOrAddToStore (store, key, value)
{
    if (store.findRecord ('name', key) == null)
    {
        store.add ({'name':key, 'value':value});
    }
    else
    {
        store.findRecord ('name', key).set ('value', value);

        // Sencha Touch 1.1.1 has a bug that can cause modified records not to be saved.
        // The dirty flag has to be set manually to true;
        store.findRecord ('name', key).dirty = true;
    }
    store.sync ();
}

//Function checking that record doesn't already exist and adds to store if not.
function addIfDoesntExist (store, key, value)
{
    if (store.findRecord ('name', key) == null)
    {
        store.add ({'name':key, 'value':value});
    }
}