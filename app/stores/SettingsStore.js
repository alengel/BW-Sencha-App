//Stores the persistant data to the local storage.
Ext.regStore ('SettingsStore', {
    model   :'SettingsModel',
    autoLoad:true,
    autoSave:true
});

Brandwatch.stores.settingsStore = Ext.StoreMgr.get ('SettingsStore');