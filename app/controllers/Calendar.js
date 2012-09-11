//Layout of the Calendar Screen.
Brandwatch.views.Calendar = Ext.extend (Ext.Panel, {

    layout:'fit',

    initComponent:function ()
    {
        Ext.util.Format.defaultDateFormat = 'D, d M Y';
        var startDate = new Date ().add (Date.DAY, -7);
        var endDate = new Date ();
        var yearFrom = new Date ().add (Date.MONTH, -6);
        var record = Brandwatch.stores.settingsStore.findRecord ('name', 'lastQuery').get ('value');

        var topToolbar = new Ext.Toolbar
            ({
                title:'Start & End'
            });

        var bottomToolbar = new Ext.Toolbar
            ({
                dock :'bottom',
                items:
                [
                    {
                        xtype  :'button',
                        text   :'Cancel',
                        ui     :'decline',
                        handler:function ()
                        {
                            Ext.dispatch
                            ({
                                controller:Brandwatch.controllers.controller,
                                action    :'backToDashboard',
                                historyUrl:'dashboard',
                                data      :record
                            });
                        }
                    },
                    {
                        xtype:'spacer'
                    },
                    {
                        xtype  :'button',
                        text   :'Apply',
                        ui     :'action',
                        handler:function ()
                        {
                            var startDate = Ext.getCmp ('startDate').getValue ().format ("Y-m-d");
                            var endDate = Ext.getCmp ('endDate').getValue ().format ("Y-m-d");

                            updateOrAddToStore (Brandwatch.stores.settingsStore, 'startDate', startDate);
                            updateOrAddToStore (Brandwatch.stores.settingsStore, 'endDate', endDate);

                            getSummary (key, record.id, startDate, endDate);

                            Ext.dispatch
                            ({
                                controller:Brandwatch.controllers.controller,
                                action    :'backToDashboard',
                                historyUrl:'overview',
                                data      :record
                            });
                        }
                    }
                ]
            });

        //Layout of button row containing prefdefined calendar choices.
        var predefinedCalendarOptions = new Ext.TabBar
        ({
            id    :'tabButtonsBar',
            layout:
            {
                pack:'center'
            },
            ui    :'dark',
            items :
            [
                {
                    text   :'Today',
                    id     :'todaySelect',
                    cls    :'preDefinedBtn',
                    handler:function ()
                    {
                        getDate ('todaySelect')
                    }
                },
                {
                    text   :'7d',
                    id     :'weekSelect',
                    cls    :'preDefinedBtn',
                    handler:function ()
                    {
                        getDate ('weekSelect')
                    }
                },
                {
                    text   :'14d',
                    id     :'twoweekSelect',
                    cls    :'preDefinedBtn',
                    handler:function ()
                    {
                        getDate ('twoweekSelect')
                    }
                },
                {
                    text   :'1m',
                    id     :'monthSelect',
                    cls    :'preDefinedBtn',
                    handler:function ()
                    {
                        getDate ('monthSelect')
                    }
                },
                {
                    text   :'2m',
                    id     :'twomonthSelect',
                    cls    :'preDefinedBtn',
                    handler:function ()
                    {
                        getDate ('twomonthSelect')
                    }
                }
            ]
        });

        //
        var dateFields =
        {
            xtype   :'fieldset',
            id      :'calendar',
            defaults:
            {
                labelAlign:'left'
            },

            items:
            [
                {
                    xtype :'datepickerfield',
                    id    :'startDate',
                    name  :'startDate',
                    label :'Starts',
                    picker:{
                        slotOrder:['day', 'month', 'year'],
                        yearFrom :yearFrom.format ("Y")
                    },
                    value :startDate
                },
                {
                    xtype :'datepickerfield',
                    id    :'endDate',
                    name  :'endDate',
                    label :'Ends',
                    picker:{
                        slotOrder:['day', 'month', 'year'],
                        yearFrom :yearFrom.format ("Y")
                    },
                    value :endDate
                }
            ]
        };

        //Overlay containing the calendar date picker.
        var overlay = new Ext.form.FormPanel
        ({
            dockedItems:[topToolbar, bottomToolbar],
            items      :[predefinedCalendarOptions, dateFields],
            scroll     :'vertical'
        });

        Ext.apply (this, {
            items:[overlay]
        });

        Brandwatch.views.Calendar.superclass.initComponent.call (this);
    }
});

//Function getting the current date and dates for the predefined date choices.
function getDate (id)
{
    var startDate = new Date ();
    var endDate = new Date ();

    switch (id)
    {
        case "todaySelect":
            break;

        case "weekSelect":
            startDate = new Date ().add (Date.DAY, -7);
            break;

        case "twoweekSelect":
            startDate = new Date ().add (Date.DAY, -14);
            break;

        case "monthSelect":
            startDate = new Date ().add (Date.MONTH, -1);
            break;

        case "twomonthSelect":
            startDate = new Date ().add (Date.MONTH, -2);
            break;

        default:
            console.log ("unknown" + id);
    }

    updateDateFields (startDate, endDate);
}

//Formats the date to "Jan 01, 2012".
function formatDate (date)
{
    return date.format ("M d, Y");
}

//Formats the date to "01 January 2012".
function formatlongDate (date)
{
    return date.format ("d F Y");
}

//Formats the date to "Jan 01".
function formatshortDate (date)
{
    return date.format ("M d");
}

//Sets the start and end date to the their most current value.
function updateDateFields (startDate, endDate)
{
    Ext.getCmp ('startDate').setValue (startDate);
    Ext.getCmp ('endDate').setValue (endDate);
}		