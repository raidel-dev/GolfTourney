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
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function login() {
$("#error").html("");
    $("#login-image").attr("src","img/GolfTourney-Without-Shadow-Loop.gif");
    $.ajax({
        url: wp_ajax_url,
        type: "POST",
        beforeSend: function (request)
        {
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        },
        //dataType: 'json',
        data: {
            action: "GolfTourney_Email_Notifications_Password_Check_request",
            user: $("#Username").val(),
            pass: $("#Password").val()
        },
        success: function (result) {
            $("#login-image").attr("src","img/GolfTourney-Without-Shadow.gif");
            if(result == "true")
            {
                setCookie("user", $("#Username").val(), 30);
                setCookie("pass", $("#Password").val(), 30);
                window.location = "index.html";
            }
            else
            {
                debuger_1 = result;
                $("#error").html("Login failed: Ensure your Username and Password are correct.");
            }
            return 0;
        },
        error: function (result) {
            $("#login-image").attr("src","img/GolfTourney-Without-Shadow.gif");
            debuger_1 = result;
            $("#error").html("Login failed: Could not connect with server.");
            return 1;
        }
    });
}

jQuery(document).ready(function ($) {
    
    //On forgot password press.
    document.getElementById("forgot-password-button").addEventListener("click", function () {
        viewLink(wp_forgot_url);
    });
    
    // Perform AJAX login on form submit
    $('#login-form').on('submit', function (e){
        e.preventDefault();
        login();
    });
    
    //Autologin.
    if(getCookie("user") != "" && getCookie("pass") != "")
    {
        $("#Username").val(getCookie("user"));
        $("#Password").val(getCookie("pass"));
        $('#login-form').submit();
    }
});
