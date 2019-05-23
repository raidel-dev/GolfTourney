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

jQuery(document).ready(function ($) {
    // Perform AJAX login on form submit
    $('#create-form').on('submit', function (e) {
        e.preventDefault();
        $("#profile-update-button").prop('disabled', true);
        //Validate empty fields.
        $("#error").html("");
        var valid = true;
        var fields = ["username", "email", "password", "firstname", "lastname"];
        var i, l = fields.length;
        var fieldname;
        for (i = 0; i < l; i++) {
            fieldname = fields[i];
            if ($("#"+fieldname).val() === "") {
                $("#error").html($("#error").html()+fieldname.capitalize() + " can not be empty. <br/>");
                valid = false;
            }
        }
        //Make sure password is the same and submit.
        if ($("#password").val() === $("#confirm-password").val() && valid)
        {
            $.ajax({
                url: wp_ajax_url,
                type: "POST",
                beforeSend: function (request)
                {
                    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                },
                dataType: 'json',
                data: {
                    action: "GolfTourney_Email_Notifications_Create_User_request",
                    username: $("#username").val(),
                    password: $("#password").val(),
                    email: $("#email").val(),
                    firstname: $("#firstname").val(),
                    lastname: $("#lastname").val(),
                    phone: $("#phone").val(),
                    gender: $("#gender").val(),
                    city: $("#city").val(),
                    state: $("#state").val(),
                    country: $("#country").val(),
                    postal: $("#zip").val(),
                },
                success: function (result) {
                    debuger_1 = result;
                    if (result[0])
                    {
                        setCookie("user", $("#username").val(), 30);
                        setCookie("pass", $("#password").val(), 30);
                        window.location = "index.html";
                    } else
                    {
                        alert(result[1]);
                    }
                    return 0;
                },
                error: function (result) {
                    debuger_1 = result;
                    alert("Create Account Failed! -Client Error");
                    return 1;
                }
            });
        } else
        {
            $("#error").html($("#error").html()+"Passwords do not match.");
            $("#profile-update-button").prop('disabled', false);
        }
    });
    document.getElementById("terms").addEventListener("click", toggleCategoryButtons);
    function toggleCategoryButtons()
    {
        viewLink(gt_terms);
    }
    document.getElementById("privacy").addEventListener("click", toggleCategoryButtons);
    function toggleCategoryButtons()
    {
        viewLink(gt_privacy);
    }
});
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
