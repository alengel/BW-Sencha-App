//Handles the back button logic by adding the new screen to a history stack
// and removing the screen when the user uses the back button.
Brandwatch.controllers.BackButton = Ext.extend (Ext.Button, {
    ui    :'back',
    text  :'back',
    hidden:false,
    cls   :'buttonText',

    handler:function ()
    {
        var dispatchOptions = this.backStack.pop ();
        this.setVisible (true);
        Ext.dispatch (dispatchOptions);
    },

    backStack:[],

    addToBackStack:function (dispatchOptions)
    {
        var found = false;

        if (!found)
        {
            this.backStack.push (dispatchOptions);
        }
        this.show ();
    },

    clearBackStack:function ()
    {
        this.backStack = [];
    }
});

Brandwatch.controllers.backButton = new Brandwatch.controllers.BackButton ();