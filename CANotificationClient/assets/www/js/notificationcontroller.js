/* This controller is in charge of previewing the notification
   with the chosen notification preview technique*/

var notificationController = {

    /* Callback from pusher service returning notification data */
    handleEvent : function( data ) {
        notificationController.previewNotification(data);
    },

    /* Previews notification with certain preview techniques
       such as dialog, list, notification tray. */
    previewNotification : function(data){

         /* Adds notification to the application list of received notifications. */
        if($('#notification-history li').length > 9){
             $('#notification-history li:last-child').remove();
        }
        var currentTime = new Date();
        var currentTimeStr = currentTime.toString("MM/dd/yyyy")+" "+currentTime.toString("hh:mm:ss tt");

        $('#notification-history').prepend('<li>' + JSON.stringify(data.message, null, 2) + "<br/>"+currentTimeStr + '</li>');
        notificationController.soundHelper(data.beep.list, data.vibrate.list);


        /* Previews notification in a dialog. */
        if(data.dialog == "true"){
           navigator.notification.alert(JSON.stringify(data.message, null, 2),
               function(){            // on dialog confirm
                    if(connectionManager.getConnStatus()=="disconnected" ||
                        connectionManager.getConnStatus()=="unavailable"){
                        console.log(connectionManager.getConnStatus());
                        connectionManager.connect();
                      }
               },
               "Message",
               "OK");
           notificationController.soundHelper(data.beep.dialog, data.vibrate.dialog);
        }

        /* Previews notification in a notification bar. */
        if(data.notificationtray == "true"){
           var setup = new Object();
           setup.onclick = function(){       // on dialog confirm
                navigator.notification.alert(
                   JSON.stringify(data.message, null, 2),
                   function(){
                      if(connectionManager.getConnStatus()=="disconnected" ||
                            connectionManager.getConnStatus()=="unavailable"){
                        console.log("CONN STATUS:"+connectionManager.getConnStatus());
                        connectionManager.connect();
                      }
                   },
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

    /* Plays sound or vibration */
    soundHelper : function(beep,vibrate){
        if(beep == "true"){
            navigator.notification.beep(1);
        }
        if(vibrate == "true") {
            navigator.notification.vibrate(1000);
        }
    },

    /* Remove all notifications' messages from the list */
    clearNotificationList : function(){
        $('#notification-history').empty();
    }

};
