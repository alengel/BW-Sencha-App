//The LoginView allows the user to login to Brandwatch and/or request a forgotten password.
Brandwatch.views.LoginView = Ext.extend (Ext.form.FormPanel, {
    scroll:'vertical',

    initComponent:function ()
    {

        this.topToolbar = new Ext.Toolbar
        ({
            title:'Brandwatch'
        });

        //Initializes the visible login fields.
        this.fields =
        {
            xtype         :'fieldset',
            submitOnAction:true,
            id            :'login',
            defaults      :
            {
                labelAlign:'left',
                labelWidth:'40%'
            },

            items:
            [
                {
                    xtype:'emailfield',
                    name :'email',
                    label:'Email',
                },
                {
                    xtype:'passwordfield',
                    name :'password',
                    label:'Password',
                },
                {
                    xtype:'checkboxfield',
                    id   :'RememberMe',
                    cls  :'x-checkbox',
                    name :'RememberMe',
                    label:'Remember Login'
                }
            ]
        };

        //Initializes the button. On button click, capture the field (login + password) values & passes them to the Controller.
        this.login = new Ext.Button
        ({
            cls    :'loginbutton',
            text   :'Login',
            handler:loginTap = function ()
            {
                Ext.dispatch
                ({
                    controller:'Controller',
                    action    :'onLogin',
                    data      :Brandwatch.views.LoginView.getValues (),
                    historyUrl:'landing'
                });
            }
        });

        //Function making the hidden elements visible.
        this.makeVisible = function ()
        {
            this.forgotten.items.items[1].show ();
            this.forgotten.items.items[2].show ();
            this.forgotten.items.items[3].show ();
        }

        //Initializes the forgotten password fields & button.
        this.forgotten = new Ext.Container
        ({
            items:
            [
                {
                    xtype:'container',
                    id   :'forgotten',
                    html :'<a href="#" onclick="Brandwatch.views.LoginView.makeVisible()">Forgotten your password?</a>'
                },
                {
                    xtype   :'emailfield',
                    cls     :'forgottenfield',
                    name    :'emailforgotten',
                    label   :'Enter your email',
                    hidden  :true,
                    required:true
                },
                {
                    xtype :'container',
                    cls   :'forgottenfield',
                    html  :"We'll email you a link to a page where you can set a new password.",
                    hidden:true
                },
                {
                    xtype  :'button',
                    cls    :'loginbutton',
                    text   :'Continue',
                    hidden :true,
                    handler:continueTap = function ()
                    {
                        Ext.dispatch
                        ({
                            controller:'Controller',
                            action    :'oncontinue'
                        });
                    }
                }
            ]
        });

        //Adds the fields to the view, which makes them visible.
        this.dockedItems = [this.topToolbar];
        this.items = [this.fields, this.login, this.forgotten];

        Brandwatch.views.LoginView.superclass.initComponent.call (this);
    }
});