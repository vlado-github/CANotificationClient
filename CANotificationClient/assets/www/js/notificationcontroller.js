/* This controller is in charge of previewing the notification
   with the chosen notification preview technique*/

var notificationController = {

    APP_KEY: function() {
            return 'a247f9dd8328ce03ba6d';
    },

    connect : function(){
        //connect
        var pusher = new Pusher(notificationController.APP_KEY());
        var connStatus = '';
        pusher.connection.bind('state_change',function(state){
            connStatus = state.current;
        });

        //subscribe
        var channel = pusher.subscribe('my-channel');
        channel.bind('pusher:subscription_succeeded',function(){
            if(connStatus == "connected"){
                $('#connectionStatus').css("color","lime");
                $('#connectionStatus').text(connStatus);
            }else{
                $('#connectionStatus').css("color","red");
                $('#connectionStatus').text("unavailable");
            }
        });
        channel.bind('my-event', notificationController.handleMyEvent);
    },

    handleMyEvent : function( data ) {
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
               function(){
                  if(pusher.connection.state!="connected")
                    notificationController.connect();
               },
               "Message",
               "OK");
           notificationController.soundHelper(data.beep.dialog, data.vibrate.dialog);
        }

        /* Previews notification in a notification bar. */
        if(data.notificationtray == "true"){
           var setup = new Object();
           setup.onclick = function(){
                navigator.notification.alert(
                   JSON.stringify(data.message, null, 2),
                   null,
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

    // on dialog confirm
    confirmNotificationInTrayClick : function(){
        if(pusher.connection.state!="connected")
            notificationController.connect();
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
