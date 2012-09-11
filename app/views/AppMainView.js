//The MainView contains the whole application.
Brandwatch.views.AppMainView = Ext.extend (Ext.Panel, {

    fullscreen:true,
    layout    :'card',

    cardSwitchAnimation:'slide',

    //Function initializing the first specified screen, the LoginView.
    initComponent:function ()
    {
        Ext.apply (Brandwatch.views,
            {
                LoginView:new Brandwatch.views.LoginView ()
            });

        //Function hiding the URL bar of the browser.
        hideAddressBar = function ()
        {
            window.scrollTo (0, 0);
            var nPageH = document.height;
            var nViewH = window.outerHeight;
            if (nViewH > nPageH)
            {
                nViewH -= 250;
                document.body.style.height = nViewH + 'px';
            }

            window.scrollTo (0, 1);
        },

            ////Adds the elements to the view, which makes them visible.
            this.items =
            [
                    Brandwatch.views.LoginView
            ]

        Brandwatch.views.AppMainView.superclass.initComponent.call (this);
    }
});