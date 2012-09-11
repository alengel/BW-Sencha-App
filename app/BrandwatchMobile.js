/**
 * Author: Alena Ruprecht
 * Application: Brandwatch Mobile
 * Date: April 2012
 **/

//First script called from HTML, launches the application and controller.
var BrandwatchMobile = new Ext.Application
({
    name               :'Brandwatch',
    useLoadMask        :true,
    tabletStartupScreen:'lib/resources/images/tablet_startup.png',
    phoneStartupScreen :'lib/resources/images/phone_startup.png',
    icon               :'lib/resources/images/icon.png',
    glossOnIcon        :true,
    fullscreen         :true,

    launch:function ()
    {
        Ext.dispatch
        ({
            controller:Brandwatch.controllers.controller,
            action    :'setFirstApplicationPage',

            //Adds hashtag to the URL.
            historyUrl:'#'
        });
    }
});