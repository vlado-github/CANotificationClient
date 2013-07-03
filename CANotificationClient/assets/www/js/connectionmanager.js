/* PusherService singleton instance, representing connection to the Pusher PNS*/
var pusherService = new function() {
    this.API_KEY = '<API_KEY>';
    this.pusher = new Pusher(this.API_KEY);
    this.getInstance = function () {
        return this.pusher;
    };
}

/* ConnectionManager is used to establish connection to the the Pusher PNS
   and also provide current connection status */
var connectionManager = {
        /* Connects to the Pusher notification service */
        connect : function(){
            if(connectionManager.getConnStatus()!="connected"){
                var pusher = pusherService.getInstance();
                var connStatus = '';
                pusher.connection.bind('state_change',function(state){
                    console.log("CONNECTING....");
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
                channel.bind('my-event', notificationController.handleEvent);
            }
        },

        /* Returns the current status of the Pusher notification service */
        getConnStatus : function(){
            var pusher = pusherService.getInstance();
            return pusher.connection.state;
        }
}