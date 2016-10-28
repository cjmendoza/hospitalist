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
var initialHref;
var app = {
  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    console.log('Received Device Ready Event');
    console.log('calling setup push');
    app.setupPush();
  },
  setupPush: function () {
    console.log('calling push init');
    var push = PushNotification.init({
      "android": {
        "senderID": "760693419183"
      },
      "browser": {},
      "ios": {
        "sound": true,
        "vibration": true,
        "badge": true
      },
      "windows": {}
    });
    console.log('after init');

    push.on('registration', function (data) {
      console.log('registration event: ' + data.registrationId);

      var oldRegId = localStorage.getItem('registrationId');
      if (oldRegId !== data.registrationId) {
        // Save new registration ID
        localStorage.setItem('registrationId', data.registrationId);
        // Post registrationId to your app server as the value has changed
        document.getElementById('notification-id').value = data.registrationId;
      }

      var parentElement = document.getElementById('registration');
      var listeningElement = parentElement.querySelector('.waiting');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');
    });

    push.on('error', function (e) {
      console.log("push error = " + e.message);
    });

    push.on('notification', function (data) {
      console.log('notification event');
      navigator.notification.alert(
        data.message,         // message
        null,                 // callback
        data.title,           // title
        'Ok'                  // buttonName
      );
    });
  },
  setConnection: function () {
    var networkState = checkConnection();
    /* load local files if there is not network connection */
    if (networkState == Connection.NONE) {
      window.location = "local_index.html";
    } else {
      document.getElementById('notification-id').value = localStorage.getItem('registrationId');
      console.log('notification id for login set to: ' + document.getElementById('notification-id').value);
      initialHref = window.location.href;
      //window.location = 'https://vidaguard.com/mobile';
    }
  }
};

function restartApplication() {
  // Show splash screen (useful if your app takes time to load)
  navigator.splashscreen.show();
  // Reload original app url (ie your index.html file)
  window.location = initialHref;
}

//Check Connection
function checkConnection() {
  var networkState = navigator.network.connection.type;
  var states = {};
  states[Connection.UNKNOWN] = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI] = 'WiFi connection';
  states[Connection.CELL_2G] = 'Cell 2G connection';
  states[Connection.CELL_3G] = 'Cell 3G connection';
  states[Connection.CELL_4G] = 'Cell 4G connection';
  states[Connection.NONE] = 'No network connection';

  return networkState;

}
