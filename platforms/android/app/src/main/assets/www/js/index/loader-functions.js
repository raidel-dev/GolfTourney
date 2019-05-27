
//Loads the check boxes for the categories.
function load_event_search_categories()
{
    $("#categories-select").html("");
    $("#categories-select").append('<optgroup label="Most Popular"><option value="2">Stroke Play</option><option value="11">4 Person Best Shot (Scramble)</option><option value="51">Junior</option></optgroup>');
    $("#categories-select").append('<optgroup label="All Formats">');
    for (var i = 0, len = event_categories.length; i < len; i++)
    {
        if (event_categories[i].name.toUpperCase().indexOf("(SELECT BELOW)") === -1 && event_categories[i].term_id != 11 && event_categories[i].term_id != 51 && event_categories[i].term_id != 2)
        {
            $("#categories-select").append("<option id='category_'" + event_categories[i].term_id + " value='" + event_categories[i].term_id + "' checked>" + event_categories[i].name + "</option>");
        }
    }
    $("#categories-select").append('</optgroup>');
    $("#categories-select option").prop('selected', true);
    $('#categories-select').multiselect({
        includeSelectAllOption: true
    });
}
//Loads the select options for the categories.
function load_golfer_search_categories()
{
    for (var i = 0, len = event_categories.length; i < len; i++)
    {
        if (event_categories[i].name.toUpperCase().indexOf("(SELECT BELOW)") === -1)
        {
            $('#golfer_favorite_tournament').append($('<option>', {
                value: event_categories[i].term_id,
                text: event_categories[i].name
            }));
        }
    }
}
//Loads the events into the table.
function load_events()
{
    if (event_list.length > 0)
    {
        $("#results-table").css("display", "block");
        $("#results-label").css("display", "none");
    } 
    else
    {
        $("#results-label").css("display", "block");
        $("#results-label").html("Your search did not produce any results. Please broaden your search.");
    }
    for (var i = 0, len = event_list.length; i < len; i++)
    {
        /*if(i > 0)
         {
         if(event_list[i].event_start_date != event_list[i-1].event_start_date)
         {
         $("#event-list").append("<thead><tr><th>"+event_list[i].event_start_date+"</th></tr></thead>");
         }
         }*/

        $('#event-list').html(function (index, html) {
            return html.replace('</tbody>', '');
        });
        //Categories
        var categories = event_list[i].categories.categories;
        var categories_string = "<br>";
        //Dates
        var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        var startdate = new Date(event_list[i].start_date);
        startdate.setDate(startdate.getDate()+1);
        var month = monthNames[startdate.getMonth()];
        var day = ("0" + (startdate.getDate())).slice(-2);
        startdate = ("0" + (startdate.getMonth() + 1)).slice(-2) + "-" + ("0" + startdate.getDate()).slice(-2) + "-" + startdate.getFullYear();
        for (var category in categories)
        {
            categories_string = categories_string.concat(categories[category].name);
            categories_string = categories_string.concat("<br>");
        }
        var image = "";
        if (event_list[i].image != false)
        {
            image = "<img style='max-width: 100%; max-height: 100%;' src='data:image/png;base64," + event_list[i].image + "' />";
        }
        //$("#event-list").append("<tbody><tr><td><b>From:</b><br/>" + startdate + "<br/><b>To:</b><br/>" + enddate + "</td><td><a href='#' class='event-link' id='event-list-" + event_list[i].id + "-click'>" + event_list[i].event_name + "</a>" + categories_string + "<br>" + event_list[i].location.name + "<br>" + event_list[i].location.location_address + "<br>" + "Distance: " + Math.round((event_list[i].distance / 1609.34) * 100) / 100 + " miles" + "</td></tr>");
        $("#event-list").append("<tbody><tr><td class='event-date' id='event-date-" + event_list[i].id + "-click' style='vertical-align: middle !important;'><div class='date_circle'>" + month + "<br/>" + day + "</div></td><td class='event-item' id='event-item-" + event_list[i].id + "-click'><a href='#\' class='event-link' id='event-list-" + event_list[i].id + "-click'>" + event_list[i].event_name + "</a>" + categories_string + "<br>" + event_list[i].location.name + "<br>" + event_list[i].location.location_address + "<br>" + "Distance: " + Math.round((event_list[i].distance / 1609.34) * 100) / 100 + " miles" + "</td></tr>");
        //$("#event-list").append("<tbody><tr><td>" + event_list[i].event_start_date + "<br>" + event_list[i].event_end_date + "</td><td><a href='#' class='event-link' id='event-list-"+event_list[i].id+"-click'>" + event_list[i].event_name + "</a>" + categories_string + "<br>" + event_list[i].location.name + "<br>" + event_list[i].location.location_address + "<br>" + "Distance: " + Math.round((event_list[i].distance/1609.34) * 100)/100 + " miles"+ "<br>" + image +"</td></tr>");
        //$("#event-list").append("<tr><td><a href='#' class='event-link' id='event-list-"+event_list[i].id+"-click'>" + event_list[i].event_name + "</a>" + categories_string + "<br>" + event_list[i].location.name + "<br>" + event_list[i].location.location_address + "<br>" + "Distance: " + Math.round((event_list[i].distance/1609.34) * 100)/100 + " miles"+ "<br>" + image +"</td></tr>");
    }
    $("#event-list").append("</tbody>");
    $('.event-item').click(function () {
        switchView("event", true, event_list_archive[$(this).attr('id').split("-")[2]].id.toString());
    });
    $('.event-date').click(function () {
        switchView("event", true, event_list_archive[$(this).attr('id').split("-")[2]].id.toString());
    });
}
//Loads specified event into viewer.
function load_event(event)
{
    //Generates category string.
    var categories = event_list_archive[event].categories.categories;
    //var categories_string = "<br>";
    var categories_string = "";
    
    //Turn off the banners
    $("#spotlight-banner").css("display","none");
    $("featured-banner").css("display","none");
    
    for (var category in event_list_archive[event].categories.categories)
    {
        categories_string = categories_string.concat(categories[category].name);
        //categories_string = categories_string.concat("<br>");
        if(categories[category].name == "Spotlight")
        {
            $("#spotlight-banner").css("display","block");
        }
        if(categories[category].name == "Featured")
        {
            $("#featured-banner").css("display","block");
        }
    }

    //Dates
    var startdate = new Date(event_list_archive[event].start_date);
    startdate.setDate(startdate.getDate()+1)
    startdate = ("0" + (startdate.getMonth() + 1)).slice(-2) + "-" + ("0" + (startdate.getDate())).slice(-2) + "-" + startdate.getFullYear();
    var enddate = new Date(event_list_archive[event].end_date);
    enddate.setDate(enddate.getDate()+1);
    enddate = ("0" + (enddate.getMonth() + 1)).slice(-2) + "-" + ("0" + (enddate.getDate())).slice(-2) + "-" + enddate.getFullYear();
    var datestring = startdate;
    if(startdate !== enddate)
    {
        datestring += " - "+enddate;
    }

    $("#selected-event-heading").html(event_list_archive[event].name);
    $("#banner-details").html(datestring + " | " + event_list_archive[event].location.name + " - " + event_list_archive[event].location.location_town + ", " + event_list_archive[event].location.location_state + " | " + categories_string);
    $("#mid_post_date").html(datestring);
    $("#mid_post_location_name").html(event_list_archive[event].location.name);
    $("#mid_post_location_town_state").html(event_list_archive[event].location.location_town + ", " + event_list_archive[event].location.location_state);
    $("#mid_post_price").html(event_list_archive[event].location.name);
    if ("undefined" !== typeof event_list_archive[event].notes) {
        $("#summary-notes").html(event_list_archive[event].notes);
        $("#summary-notes img").remove();
        $("#summary-notes").html(linkPhoneNumbers(anchorme($("#summary-notes").html())));
    }
    if ("undefined" !== typeof event_list_archive[event].image && event_list_archive[event].image != false) {
        $("#summary-image").html("<img style='max-width: 100%;' src='data:image/png;base64," + event_list_archive[event].image + "' />");
    }
    if("undefined" !== typeof event_list_archive[event].event_owner_email && event_list_archive[event].event_owner_email != null)
    {
        $(".contact_section").css("display","block");
        $("#contact-response").html("");
        $("#contact-form").css("display", "block");
        if("undefined" !== typeof profile_personal.fname && "undefined" !== typeof profile_personal.lname){$("#contact-name").val(profile_personal.fname + " " + profile_personal.lname);}
        if("undefined" !== typeof profile_personal.email){$("#contact-email").val(profile_personal.email);}
        if("undefined" !== typeof profile_personal.phone){$("#contact-phone").val(profile_personal.phone);}
        $("#contact-id").val(event);
    }
    else
    {
        $(".contact_section").css("display","none");
    }
    if (event_list_archive[event].event_rsvp == "1")
    {
        $("#event_external_link").html("Register");
        $("#event_external_link").attr("link", event_list_archive[event].guid + "#register");
    } else
    {
        $("#event_external_link").html("View on GolfTourney.com");
        $("#event_external_link").attr("link", event_list_archive[event].guid);
    }
    
    //Handle links.
    $('#summary-notes a').click(function (event) {
        event.preventDefault();
        viewLink($(this).attr("href"));
        // or use return false;
    });
}
//Loads profile data into table.
function load_profile_personal()
{
    //Profile View
    $("#profile-fname").html(profile_personal.fname);
    $("#profile-lname").html(profile_personal.lname);
    $("#profile-birthday").html(profile_personal.birthday);
    $("#profile-phone").html(profile_personal.phone);
    $("#profile-email").html(profile_personal.email);
    $("#profile-gender").html(profile_personal.gender);

    //Update View
    $("#update-firstname").val(profile_personal.fname);
    $("#update-lastname").val(profile_personal.lname);
    $("#update-birthday").val(formatDate(profile_personal.birthday));

    $("#update-phone").val(profile_personal.phone);
    $("#update-email").val(profile_personal.email);
    $("#update-gender").val(profile_personal.gender);
}
//Loads profile data into table.
function load_profile_geo()
{
    //Profile View
    $("#profile-street").html(profile_geo.street);
    $("#profile-city").html(profile_geo.city);
    $("#profile-state").html(profile_geo.state);
    $("#profile-country").html(profile_geo.country);
    $("#profile-postal").html(profile_geo.postal);
    $("#postal").val(profile_geo.postal);

    //Update View
    $("#update-street").val(profile_geo.street);
    $("#update-city").val(profile_geo.city);
    $("#update-state").val(profile_geo.state);
    $("#update-country").val(profile_geo.country);
    $("#update-zip").val(profile_geo.postal);
}
//Loads profile data into table.
function load_profile_golf()
{
    //Profile View
    $("#profile-favorite-format").html(profile_golf.favorite_format);
    $("#profile-favorite-brand").html(profile_golf.favorite_brand);

    //Update View
    $("#update-favformats").val(profile_golf.favorite_format);
    $("#update-favbrands").val(profile_golf.favorite_brand);
}
//Loads profile avatar into table.
function load_profile_avatar()
{
    var image = profile_avatar;
    if (image.indexOf("data:image/") ==-1) {
        image = "data:image/png;base64," + image;
    }
    $("#profile-img").attr("src", image);
    $("#update-profile-image").attr("src", image);
}
//Load array list of objects.
function load_needed_objects(objects)
{
    for (var i = 0, len = objects.length; i < len; i++)
    {
        wp_loaded[objects[i]] = "loading";
        switch (objects[i])
        {
            case "event_categories":
                get_categories();
                break;
            case "event_list":
                get_events();
                break;
            case "profile_personal":
                get_profile_personal();
                break;
            case "profile_geo":
                get_profile_geo();
                break;
            case "profile_golf":
                get_profile_golf();
                break;
            case "profile_avatar":
                get_profile_avatar();
                break;
            default:
                return 1;
        }
    }
    $("#loading-menu-image").css("top", 100);
    $(".window-shown").addClass("blur");
    waitForLoadFinish();
    return 0;
}
//Close loading window when loading is complete
function waitForLoadFinish() {
    loading = true;
    console.log("Waiting for loading to complete.");
    var wait_again = false;

    for (var key in wp_loaded) {
        var value = wp_loaded[key];
        if (value === "loading")
        {
            wait_again = true;
        }
    }
    if (wait_again) {
        setTimeout(waitForLoadFinish, 500);
    } else {
        //Set loading spinner to hide above page.
        console.log("Loading complete.");
        $("#loading-menu-image").css("top", -($("#loading-menu-image").height()));
        $(".blur").removeClass("blur");
        loading = false;
    }
}

//Update profile
function updateProfile(updates)
{
    for (var i = 0, len = updates.length; i < len; i++)
    {
        switch (updates[i].field)
        {
            case "firstname":
                if (profile_personal.fname != updates[i].val)
                {
                    wp_updated.profile_firstname = "loading";
                    update_user_firstname(updates[i].val);
                }
                break;
            case "lastname":
                if (profile_personal.lname != updates[i].val)
                {
                    wp_updated.profile_lastname = "loading";
                    update_user_lastname(updates[i].val);
                }
                break;
            case "birthday":
                if (profile_personal.birthday != updates[i].val)
                {
                    wp_updated.profile_birthday = "loading";
                    update_user_birthday(updates[i].val);
                }
                break;
            case "phonenumber":
                if (profile_personal.phone != updates[i].val)
                {
                    wp_updated.profile_phonenumber = "loading";
                    update_user_phonenumber(updates[i].val);
                }
                break;
            case "email":
                if (profile_personal.email != updates[i].val)
                {
                    wp_updated.profile_email = "loading";
                    update_user_email(updates[i].val);
                }
                break;
            case "gender":
                if (profile_personal.gender != updates[i].val)
                {
                    wp_updated.profile_gender = "loading";
                    update_user_gender(updates[i].val);
                }
                break;
            case "street":
                if (profile_geo.street != updates[i].val)
                {
                    wp_updated.profile_street = "loading";
                    update_user_street(updates[i].val);
                }
                break;
            case "city":
                if (profile_geo.city != updates[i].val)
                {
                    wp_updated.profile_city = "loading";
                    update_user_city(updates[i].val);
                }
                break;
            case "state":
                if (profile_geo.state != updates[i].val)
                {
                    wp_updated.profile_state = "loading";
                    update_user_state(updates[i].val);
                }
                break;
            case "country":
                if (profile_geo.country != updates[i].val)
                {
                    wp_updated.profile_country = "loading";
                    update_user_country(updates[i].val);
                }
                break;
            case "zip":
                if (profile_geo.postal != updates[i].val)
                {
                    wp_updated.profile_zip = "loading";
                    update_user_zip(updates[i].val);
                }
                break;
            case "favformats":
                if (profile_golf.favorite_format != updates[i].val)
                {
                    wp_updated.profile_favformats = "loading";
                    update_user_favformats(updates[i].val);
                }
                break;
            case "favbrands":
                if (profile_golf.favorite_brand != updates[i].val)
                {
                    wp_updated.profile_favbrands = "loading";
                    update_user_favbrands(updates[i].val);
                }
                break;
            case "avatar":
                if (profile_avatar != "data:image/png;base64,"+updates[i].val)
                {
                    //wp_updated.profile_avatar = "loading";
                    //update_user_avatar(updates[i].val);
                }
                break;
            default:
        }
    }
    $("#updating-menu-image").css("top", 100);
    $(".window-shown").addClass("blur");
    waitForUpdateFinish();
}

//Close updating window when loading is complete
function waitForUpdateFinish() {
    updating = true;
    console.log("Waiting for updating to complete.");
    var wait_again = false;

    for (var key in wp_updated) {
        var value = wp_updated[key];
        if (value === "loading")
        {
            wait_again = true;
        }
    }

    if (wait_again) {
        setTimeout(waitForUpdateFinish, 500);
    } else {
        //Set loading spinner to hide above page.
        console.log("Updating complete.");
        $("#updating-menu-image").css("top", -($("#updating-menu-image").height()));
        $(".blur").removeClass("blur");
        updating = false;
        load_profile_personal();
        load_profile_geo();
        load_profile_golf();
        load_profile_avatar();
        if(goto_profile)
        {
            goto_profile = false;
            switchView("profile", true);
        }
    }
}

//For formating dates.
function formatDate(date) {
    var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

//Make phone number clickable.
function linkPhoneNumbers(content)
{
    var countrycodes = "1";
    var delimiters = "-|\\.|—|–|&nbsp;";
    var phonedef = "\\+?(?:(?:(?:" + countrycodes + ")(?:\\s|" + delimiters + ")?)?\\(?[2-9]\\d{2}\\)?(?:\\s|" + delimiters + ")?[2-9]\\d{2}(?:" + delimiters + ")?[0-9a-z]{4})";
    
    var spechars = new RegExp("([- \(\)\.:]|\\s|" + delimiters + ")","gi");
    var phonereg = new RegExp("((^|[^0-9])(href=[\"']tel:)?((?:" + phonedef + ")[\"'][^>]*?>)?(" + phonedef + ")($|[^0-9]))","gi");
    
    var newhtml = content.replace(/href=['"]callto:/gi,'href="tel:')
    
    newhtml = content.replace(phonereg, function ($0, $1, $2, $3, $4, $5, $6) {
        if ($3) return $1;
        else if ($4) return $2+$4+$5+$6;
        else return $2+"<a href='tel:"+$5.replace(spechars,"")+"'>"+$5+"</a>"+$6;
    }); 
    
    return newhtml;
}
