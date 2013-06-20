/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {


    APP_KEY: function() {
        return 'API_KEY';
    },

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {

        var connStatus = '';

        // Connect
        var pusher = new Pusher(app.APP_KEY());
        pusher.connection.bind('state_change', connectionStateChange);
        function connectionStateChange(state) {
            connStatus = state.current;
        }

        // Subscribe
        var channel = pusher.subscribe('my-channel');
        channel.bind('pusher:subscription_succeeded', subscriptionSucceeded);
        function subscriptionSucceeded() {
            if(connStatus == "connected"){
                $('#connectionStatus').css("color","green");
                $('#connectionStatus').text(connStatus);
            }else{
                $('#connectionStatus').css("color","red");
                $('#connectionStatus').text("unavailable");
            }
        }
        channel.bind('my-event', handleMyEvent);
        function handleMyEvent( data ) {
            var currentTime = new Date();
            var currentTimeStr = currentTime.toString("MM/dd/yyyy")+" "+currentTime.toString("hh:mm:ss tt");
            $('#myEventData').append('<li>' + JSON.stringify(data, null, 2) + "<br/>"+currentTimeStr + '</li>');
            navigator.notification.alert(JSON.stringify(data, null, 2), null, "Alert", "OK");
            navigator.notification.beep(1);
            navigator.notification.vibrate(1000);
        }
    }
};
