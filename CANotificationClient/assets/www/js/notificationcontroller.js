/* This controller is in charge of previewing the notification
   with the chosen notification preview technique*/

var notificationController = {

    /* Adds notification to the application list of received notifications. */
    previewNotificationInAppList : function(data){
        var currentTime = new Date();
        var currentTimeStr = currentTime.toString("MM/dd/yyyy")+" "+currentTime.toString("hh:mm:ss tt");
        $('#myEventData').append('<li>' + JSON.stringify(data.message, null, 2) + "<br/>"+currentTimeStr + '</li>');

        notificationController.soundHelper(data.beep.list, data.vibrate.list);
    },

    /* Previews notification in a dialog. */
    previewNotificationInDialog : function(data){
        if(data.dialog == "true"){
            navigator.notification.alert(JSON.stringify(data.message, null, 2));  //, function(){}, "Alert", "OK"
            notificationController.soundHelper(data.beep.dialog, data.vibrate.dialog);
        }
    },

    /* Previews notification in a notification bar. */
    previewNotificationInTray : function(data){
        if(data.notificationtray == "true"){
            var setup = new Object();
            setup.onclick = function(){
                 navigator.notification.alert(
                    JSON.stringify(data.message, null, 2),
                    notificationController.confirmNotificationInTrayClick,
                    "Message",
                    "OK"
                 );
            };
            setup.body = JSON.stringify(data.message, null, 2);
            setup.tag = "notification_bar";
            window.Notification("CANotificationClient",setup);

            notificationController.soundHelper(data.beep.tray, data.vibrate.tray);
        }
    },

    confirmNotificationInTrayClick : function(){

    },

    /* Plays sound or vibration */
    soundHelper : function(beep,vibrate){
        if(beep == "true"){
            navigator.notification.beep(1);
        }
        if(vibrate == "true") {
            navigator.notification.vibrate(1000);
        }
    }

};
