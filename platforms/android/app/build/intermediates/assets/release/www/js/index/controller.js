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

//Global variable for debugging.
var application_test;

//Holds view history.
var view_history = [];

//Holds event categories.
var event_categories;

//Holds profile details.
var profile_personal;
var profile_geo;
var profile_golf;
var profile_avatar;

//Holds search results.
var event_list;
var event_list_archive = [];
var event_list_offset = 0;
var event_list_done = true;

var loading = false;
var wp_loaded = [];
wp_loaded["event_categories"] = "false";
wp_loaded["profile_personal"] = "false";
wp_loaded["profile_geo"] = "false";
wp_loaded["profile_golf"] = "false";
wp_loaded["profile_avatar"] = "false";
wp_loaded["event_list"] = "false";

var updating = false;
var wp_updated = [];
wp_updated["profile_firstname"] = "false";
wp_updated["profile_lastname"] = "false";
wp_updated["profile_birthday"] = "false";
wp_updated["profile_phonenumber"] = "false";
wp_updated["profile_email"] = "false";
wp_updated["profile_gender"] = "false";
wp_updated["profile_street"] = "false";
wp_updated["profile_city"] = "false";
wp_updated["profile_state"] = "false";
wp_updated["profile_country"] = "false";
wp_updated["profile_zip"] = "false";
wp_updated["profile_favformats"] = "false";
wp_updated["profile_favbrands"] = "false";
wp_updated["profile_avatar"] = "false";

var goto_profile = false;


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
        StatusBar.overlaysWebView(false);
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
    
    //Set loading and updating spinner to hide above page.
    $("#loading-menu-image").css("top", -($("#loading-menu-image").height()));
    $("#updating-menu-image").css("top", -($("#updating-menu-image").height()));
    
    //Set search window below nav
    $("#search-form-window").css("top",$("#top-nav").height()+"px");

    /*
     Tab switching.
     */
    document.getElementById("search-button").addEventListener("click", function () {
        switchView("search", true);
    });
    document.getElementById("alerts-button").addEventListener("click", function () {
        switchView("alerts", true);
    });
    document.getElementById("golfers-button").addEventListener("click", function () {
        switchView("golfers", true);
    });
    document.getElementById("profile-button").addEventListener("click", function () {
        switchView("profile", true);
    });

    //On event form submission.
    document.getElementById("event-query-button").addEventListener("click", searchEvents);
    function searchEvents(evt)
    {
        evt.preventDefault();
        $("#event-list").html("<tbody><tr><th style='width: 25%;'>Date</th><th style='width: 75%;'>Tourney Info</th></tr>");
        event_list_done = false;
        event_list_offset = 0;
        //Load the list.
        $("#load-more-events").css("display","block");
        var load_list = ["event_list"];
        load_needed_objects(load_list);
        toggleSearchForm();
        //$("#results-table").css("display","block");
        $("#results-label").css("display","none");
        //switchView("events", true);
    }
    
    //On load more event.
    document.getElementById("load-more-events").addEventListener("click", loadMoreEvents);
    function loadMoreEvents(evt)
    {
        evt.preventDefault();
        load_needed_objects(["event_list"]);
    }

    //On update form submission.
    document.getElementById("profile-update-button").addEventListener("click", submitProfileUpdate);
    function submitProfileUpdate(evt)
    {
        evt.preventDefault();

        var updates = [
            {field: "firstname", val: $("#update-firstname").val()},
            {field: "lastname", val: $("#update-lastname").val()},
            {field: "birthday", val: $("#update-birthday").val()},
            {field: "phonenumber", val: $("#update-phone").val()},
            {field: "email", val: $("#update-email").val()},
            {field: "gender", val: $("#update-gender").val()},
            {field: "street", val: $("#update-street").val()},
            {field: "city", val: $("#update-city").val()},
            {field: "state", val: $("#update-state").val()},
            {field: "country", val: $("#update-country").val()},
            {field: "zip", val: $("#update-zip").val()},
            {field: "favformats", val: $("#update-favformats").val()},
            {field: "favbrands", val: $("#update-favbrands").val()},
            {field: "avatar", val: $("#update-profile-image").attr("src")}
        ];
        goto_profile = true;
        updateProfile(updates);
    }
    
    //On contact form submission.
    document.getElementById("contact-form").addEventListener("submit", submitContactForm);
    function submitContactForm(evt)
    {
        evt.preventDefault();
        $("#contact-error").html("");
        $("#contact-submit").prop('disabled', true);
        
        var id = $("#contact-id").val();
        var who = $("#contact-who").val();
        var name = $("#contact-name").val();
        var email = $("#contact-email").val();
        var phone = $("#contact-phone").val();
        var message = $("#contact-message").val();
        
        if(message.length > 500)
        {
            $("#contact-error").html("Maximum of 500 characters in message.");
        }
        else
        {
            contactEvent(id,who,name,email,phone,message);
        }
    }

    //On settings button click.
    document.getElementById("dropdown-settings-button").addEventListener("click", function () {
        $(".settings-options").css("display", "none");
        $("#logout-button").css("display", "block");
        switch ($("#view-label").html())
        {
            case "Profile":
                $("#update-button").css("display", "block");
                $("#leave-feedback-button").css("display", "block");
                break;
            case "Event Search":
                $("#post-tournament-button").css("display", "block");
                break;
        }
        document.getElementById("myDropdown").classList.toggle("show");
    });

    //On update button press.
    document.getElementById("update-button").addEventListener("click", function () {
        switchView("update_profile", true);
    });
    
    //On feedback button press.
    document.getElementById("leave-feedback-button").addEventListener("click", function () {
    });

    //On logout button press.
    document.getElementById("logout-button").addEventListener("click", function () {
        setCookie("user", "", 30);
        setCookie("pass", "", 30);
        window.location = "login.html";
    });

    //On post tournament press.
    document.getElementById("post-tournament-button").addEventListener("click", function () {
        window.open(wp_post_tournament_url, '_system');
    });
    
    //Event external link.
    document.getElementById("event_external_link").addEventListener("click", function () {
        viewLink($("#event_external_link").attr("link"));
    });
    
    $("#update-avatar").click(function() {
        $("#update-avatar").val("");
    });

    $("#update-avatar").change(function(){
        var preview = $("#update-profile-image");
        var file    =  this.files[0];
        var reader  = new FileReader();

        reader.onload = function (e) {
          $("#update-profile-image").attr("src", e.target.result)
          debuger_2 = e.target.result; 
        };

        if (file) {
          reader.readAsDataURL(file);
        }
    });
    
    //Handle back buttons.
    document.getElementById("back-button").addEventListener("click", goBackOneView);
    document.addEventListener("backbutton", goBackOneView, false);
    function goBackOneView() {
        var destination;
        do
        {
            switch ($(".active").attr('id'))
            {
                case "search-button":
                    var history = view_history.filter(getSearchViewHistory);
                    destination = history.pop();
                    index = view_history.lastIndexOf(destination);
                    view_history.splice(index, 1);
                    break;
                case "profile-button":
                    var history = view_history.filter(getProfileViewHistory);
                    destination = history.pop();
                    index = view_history.lastIndexOf(destination);
                    view_history.splice(index, 1);
                    break;
                default:
                    destination = view_history.pop();
            }
        } while (destination === $(".window-shown").attr('id'))

        if (destination)
        {
            switchView(destination, false);
        }
    }

    //History filters.
    function getSearchViewHistory(history) {
        if (history === "event" || history === "events" || history === "search")
        {
            return true;
        }
        return false;
    }
    function getProfileViewHistory(history) {
        if (history === "profile" || history === "update_profile")
        {
            return true;
        }
        return false;
    }

    //Show this page first.
    switchView("search", true);

    //Add the select all event.
    document.getElementById("select_all").addEventListener("click", toggleCategoryButtons);
    function toggleCategoryButtons(e)
    {
        e.preventDefault();
        var categories = $("#categories-select").val();

        if (categories.length < $("#categories-select option").length)
        {
            $("#categories-select option").prop('selected', true);
        } else {
            $("#categories-select").val([]);
        }
    }

    //Add range on change event
    document.getElementById("range").addEventListener("input", updateRangeDisplay);
    function updateRangeDisplay(e)
    {
        //Set range display to current value.
        $('#rangetext').text($('#range').val() + "(miles)");
    }

    //Add startdate on change event
    document.getElementById("startdate").addEventListener("input", updateDateDisplay);
    function updateDateDisplay(e)
    {
        //Set end date to be one month away.
        var start = new Date($('#startdate').val());
        start.setMonth(start.getMonth() + 1);
        var day = ("0" + start.getDate()).slice(-2);
        var month = ("0" + (start.getMonth() + 1)).slice(-2);
        var future = start.getFullYear() + "-" + (month) + "-" + (day);
        $('#enddate').val(future);
    }

    //Add search window toggle. 
    document.getElementById("toggle-search-form").addEventListener("click", toggleSearchForm);
    document.getElementById("edit-search-label").addEventListener("click", toggleSearchForm);
    function toggleSearchForm(e)
    {
        if ($("#toggle-search-form").hasClass("toggle-search-form-open"))
        {
            $("#toggle-search-form").removeClass("toggle-search-form-open").addClass("toggle-search-form-closed");
            $("#search-form-window").removeClass("pull-down-visible").addClass("pull-down-hidden");
            $("#results-table").removeClass("results-table-window").addClass("results-table-full");
            $(".pull-down-hidden").animate({
                top: "-="+($("#search-form-window").height()-$("#toggle-search-form-table").height())
            }, 1000, function () {$(".pull-down-hidden").css("top", -($("#search-form-window").height()-$("#toggle-search-form-table").height())+$("#top-nav").height());}
            );
            $(".results-table-full").animate({
                top: "-="+(($("#search-form-window").height()) - $("#toggle-search-form-table").height())
            }, 1000, function () {$(".results-table-full").css("top", $("#top-nav").height() + $("#toggle-search-form-table").height());}
            );
            
        } else
        {
            $("#toggle-search-form").removeClass("toggle-search-form-closed").addClass("toggle-search-form-open");
            $("#search-form-window").removeClass("pull-down-hidden").addClass("pull-down-visible");
            $("#results-table").removeClass("results-table-full").addClass("results-table-window");
            $(".pull-down-visible").animate({
                top: "+="+($("#search-form-window").height()-$("#toggle-search-form-table").height())
            }, 1000, function () {$(".pull-down-visible").css("top", $("#top-nav").height());}
            );
            $(".results-table-window").animate({
                top: "+="+($("#search-form-window").height()-$("#toggle-search-form-table").height())
            }, 1000, function () {$(".results-table-window").css("top", $("#search-form-window").height() + $("#top-nav").height());}
            );
        }
    }
});
//Switch View
function switchView(view, log, parm)
{
    if(loading || updating)
    {
        return;
    }
    //Default values.
    log = log || false;
    parm = parm || false;

    if ($(".window-shown").length && log)
    {
        view_history.push($(".window-shown").attr('id'));
    }
    
    $("#settings-button").css("visibility", "hidden");
    $("#back-button").css("visibility", "hidden");
    switch (view)
    {
        case "search":
            showSearchMenu();
            $("#view-label").html("Find Golf Tournaments");
            $(".menu-item").removeClass("active");
            $("#search-button").addClass("active");
            break;
        case "alerts":
            showAlertsMenu();
            $("#view-label").html("Alerts");
            break;
        case "golfers":
            showGolfersMenu();
            $("#view-label").html("Golfers");
            break;
        case "profile":
            showProfileMenu();
            $("#view-label").html("Profile");
            $(".menu-item").removeClass("active");
            $("#profile-button").addClass("active");
            $("#settings-button").css("visibility", "visible");
            break;
        case "update_profile":
            showUpdateProfileMenu();
            $("#view-label").html("Edit Profile");
            $(".menu-item").removeClass("active");
            $("#profile-button").addClass("active");
            $("#back-button").css("visibility", "visible");
            $("#settings-button").css("visibility", "visible");
            break;
        case "event":
            showEvent(parm);
            $("#view-label").html("Event");
            $(".menu-item").removeClass("active");
            $("#search-button").addClass("active");
            $("#back-button").css("visibility", "visible");
            break;
        default:
            $(".window").removeClass("window-shown").addClass("window-hidden");
            $("#" + view).removeClass("window-hidden").addClass("window-shown");
            $("#back-button").css("visibility", "visible");
            $("#settings-button").css("visibility", "visible");
    }
}
//For detecting when user sees bottom of the page.
/*$(document).ready(function () {
    var win = $(window);

    // Each time the user scrolls
    win.scroll(function () {
        // End of the document reached?
        if ($(document).height() - win.height() == win.scrollTop()) {
            if ($("#search").hasClass("window-shown") && !event_list_done && !loading)
            {
                load_needed_objects(["event_list"]);
            }
        }
    });
});*/
$(window).resize(function () {
    if ($("#loading-menu-image").css("top") !== "0px")
    {
        $("#loading-menu-image").css("top", -($("#loading-menu-image").height()));
    }
});

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('#dropdown-settings-button')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//Loading Window
var mouseY = 0;
var startMouseY = 0;
$('body').bind('mousedown touchstart', function (ev) {
    if (!loading && $(".window-shown").hasClass("refreshable"))
    {
        if (typeof ev.pageY !== 'undefined')
        {
            mouseY = ev.pageY;
        } else
        {
            var touch = ev.touches[0];
            mouseY = touch.pageY;
        }
        startMouseY = mouseY;
        $(document).bind('mousemove touchmove', function (e) {
            var pageY = 0;
            if (typeof e.pageY !== 'undefined')
            {
                pageY = e.pageY;
            } else
            {
                var touch = e.touches[0];
                pageY = touch.pageY;
            }
            if (pageY > mouseY) {
                var d = pageY - startMouseY;
                if (d >= $("#loading-menu-image").height()) {
                    $(document).unbind("mousemove touchmove");
                    if ($("#search").hasClass("window-shown"))
                    {
                        var load_list = ["event_categories"];
                        //Load the categories.
                        load_needed_objects(load_list);
                    }
                    if ($("#profile").hasClass("window-shown"))
                    {
                        var load_list = ["profile_personal", "profile_geo", "profile_golf", "profile_avatar"];
                        //Load the categories.
                        load_needed_objects(load_list);
                    }
                    if ($("#events").hasClass("window-shown"))
                    {
                        var load_list = ["event_list"];
                        //Load the categories.
                        load_needed_objects(load_list);
                    }
                } else
                {
                    $("#loading-menu-image").css("top", -($("#loading-menu-image").height()) + (d / 1));
                }
            }
        });
    }
});
$('body').bind('mouseup touchend', function () {
    if (typeof d !== 'undefined') {
        if (d < $("#loading-menu-image").height() * 3) {
            $("#loading-menu-image").css("top", -($("#loading-menu-image").height()));
        }
    } else if ($("#loading-menu-image").css("top") !== 0 && !loading)
    {
        $("#loading-menu-image").css("top", -($("#loading-menu-image").height()));
        $(document).unbind("mousemove touchmove");
    }
});
$('body').on('mouseleave', function () {
    if (typeof d !== 'undefined') {
        if (d < $("#loading-menu-image").height() * 3) {
            $("#loading-menu-image").css("top", -($("#loading-menu-image").height()));
        }
    } else if ($("#loading-menu-image").css("top") !== 0 && !loading)
    {
        $("#loading-menu-image").css("top", -($("#loading-menu-image").height()));
        $(document).unbind("mousemove touchmove");
    }
});

