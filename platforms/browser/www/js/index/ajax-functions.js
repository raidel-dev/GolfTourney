//Fetches the categories from the server.
function get_categories()
{
    /*$("#category-list-status").css("display", "block");
    $.ajax({
        url: wp_ajax_url,
        type: "POST",
        beforeSend: function (request)
        {
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        },
        dataType: 'json',
        data: {
            action: "GolfTourney_Email_Notifications_Get_Event_Categories_request"
        },
        success: function (result) {
            if (result[0])
            {
                wp_loaded.event_categories = "true";
                event_categories = result[1];
                load_event_search_categories();
                load_golfer_search_categories();
            } else
            {
                wp_loaded.event_categories = "false";
            }
            $("#category-list-status").css("display", "none");
            return 0;
        },
        error: function (result) {
            wp_loaded.event_categories = "false";
            $("#category-list-status").html("Failed...");
            return 1;
        }
    });*/
    //Hard coded to improve performance for now.
    event_categories = [{term_id: 12, name: '1 Person Best Ball'},{term_id: 13, name: '2 Person Best Ball'},{term_id: 14, name: '3 Person Best Ball'},{term_id: 15, name: '4 Person Best Ball'},{term_id: 8, name: '1 Person Best Shot (Scramble)'},{term_id: 9, name: '2 Person Best Shot (Scramble)'},{term_id: 10, name: '3 Person Best Shot (Scramble)'},{term_id: 11, name: '4 Person Best Shot (Scramble)'},{term_id: 355, name: '5 Person Best Shot (Scramble)'},{term_id: 356, name: '6 Person Best Shot (Scramble)'},{term_id: 16, name: '-Alternate Shot'},{term_id: 354, name: 'College'},{term_id: 58, name: 'Couples'},{term_id: 63, name: 'Featured'},{term_id: 353, name: 'High School'},{term_id: 51, name: 'Junior'},{term_id: 24, name: 'Match Play'},{term_id: 329, name: 'Other'},{term_id: 49, name: 'PGA Tour'},{term_id: 4, name: 'Ryder Cup'},{term_id: 314, name: 'Senior'},{term_id: 328, name: 'Shamble'},{term_id: 357, name: 'Spotlight'},{term_id: 5, name: 'Stableford'},{term_id: 2, name: 'Stroke Play'},{term_id: 62, name: 'Unspecified'},{term_id: 315, name: 'Womens'},];
    wp_loaded.event_categories = "true";
    load_event_search_categories();
    load_golfer_search_categories();
}
//Fetches the events from the server.
function get_events()
{
    if (!event_list_done)
    {
        var search_categories = $("#categories-select").val();

        $.ajax({
            url: wp_ajax_url,
            type: "POST",
            beforeSend: function (request)
            {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            },
            dataType: 'json',
            data: {
                action: "GolfTourney_Email_Notifications_Get_Events_request",
                location: $("#location").val(),
                startdate: $("#startdate").val(),
                enddate: $("#enddate").val(),
                categories: JSON.stringify(search_categories),
                userpostal: $("#postal").val(),
                eventrange: $("#range").val(),
                offset: event_list_offset,
                user: getCookie("user"),
                pass: getCookie("pass")
            },
            success: function (result) {
                debuger_2 = result;
                wp_loaded.event_list = "true";
                event_list_offset = result[0];
                event_list = result[1];
                if (event_list.length < 10)
                {
                    event_list_done = true;
                    $("#load-more-events").css("display","none");
                }
                for (var i = 0, len = event_list.length; i < len; i++)
                {
                    if (typeof event_list[i].id !== 'undefined')
                    {
                        event_list_archive[event_list[i].id.toString()] = event_list[i];
                    }
                }
                load_events();
                return 0;
            },
            error: function (result) {
                wp_loaded.event_list = "false";
                debuger_2 = result;
                return 1;
            },
            timeout: 120000
        });
    }
}
//Fetches personal details of the signed in user.
function get_profile_personal()
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
            action: "GolfTourney_Email_Notifications_Get_Profile_Personal_request",
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            if (result[0]) {
                wp_loaded.profile_personal = "true";
                profile_personal = result[1];
                load_profile_personal();
            } else
            {
                wp_loaded.profile_personal = "false";
                alert(result[1]);
            }
            return 0;
        },
        error: function (result) {
            wp_loaded.profile_personal = "false";
            return 1;
        },
        timeout: 30000
    });
}
//Fetches geo details of the signed in user.
function get_profile_geo()
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
            action: "GolfTourney_Email_Notifications_Get_Profile_Geo_request",
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            if (result[0]) {
                wp_loaded.profile_geo = "true";
                profile_geo = result[1];
                load_profile_geo();
            } else
            {
                wp_loaded.profile_geo = "false";
                alert(result[1]);
            }
            return 0;
        },
        error: function (result) {
            wp_loaded.profile_geo = "false";
            return 1;
        },
        timeout: 30000
    });
}
//Fetches golf details of the signed in user.
function get_profile_golf()
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
            action: "GolfTourney_Email_Notifications_Get_Profile_Golf_request",
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            if (result[0]) {
                wp_loaded.profile_golf = "true";
                profile_golf = result[1];
                load_profile_golf();
            } else
            {
                wp_loaded.profile_golf = "false";
                alert(result[1]);
            }
            return 0;
        },
        error: function (result) {
            wp_loaded.profile_golf = "false";
            return 1;
        },
        timeout: 30000
    });
}
//Fetches golf profile avatar of current user..
function get_profile_avatar()
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
            action: "GolfTourney_Email_Notifications_Get_Profile_Avatar_request",
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            debuger_3 = result;
            if (result[0]) {
                wp_loaded.profile_avatar = "true";
                profile_avatar = result[1];
                load_profile_avatar();
            } else
            {
                wp_loaded.profile_avatar = "false";
                alert(result[1]);
            }
            return 0;
        },
        error: function (result) {
            //alert("Error check debugger 3.");
            debuger_3 = result;
            wp_loaded.profile_avatar = "false";
            return 1;
        },
        timeout: 60000
    });
}

function update_user_firstname(val)
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
            action: "GolfTourney_Email_Notifications_update_firstname_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_firstname = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_personal.fname = val;
            } else
            {
                wp_updated.profile_firstname = "false";
                alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_firstname = "false";
            //alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_lastname(val)
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
            action: "GolfTourney_Email_Notifications_update_lastname_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_lastname = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_personal.lname = val;
            } else
            {
                wp_updated.profile_lastname = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_lastname = "false";
            //alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_birthday(val)
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
            action: "GolfTourney_Email_Notifications_update_birthday_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_birthday = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_personal.birthday = val;
            } else
            {
                wp_updated.profile_birthday = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_birthday = "false";
            //alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_phonenumber(val)
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
            action: "GolfTourney_Email_Notifications_update_phonenumber_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_phonenumber = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_personal.phone = val;
            } else
            {
                wp_updated.profile_phonenumber = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_phonenumber = "false";
            //alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_email(val)
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
            action: "GolfTourney_Email_Notifications_update_email_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_email = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_personal.email = val;
            } else
            {
                wp_updated.profile_email = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_email = "false";
            //alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_gender(val)
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
            action: "GolfTourney_Email_Notifications_update_gender_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_gender = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_personal.gender = val;
            } else
            {
                wp_updated.profile_gender = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_gender = "false";
            //alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_street(val)
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
            action: "GolfTourney_Email_Notifications_update_streetaddress_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_street = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_geo.street = val;
            } else
            {
                wp_updated.profile_street = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_street = "false";
            //alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_city(val)
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
            action: "GolfTourney_Email_Notifications_update_city_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_city = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_geo.city = val;
            } else
            {
                wp_updated.profile_city = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_city = "false";
           // alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_state(val)
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
            action: "GolfTourney_Email_Notifications_update_state_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_state = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_geo.state = val;
            } else
            {
                wp_updated.profile_state = "false";
               // alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_state = "false";
            alert("Client: Error check debugger 3.");
           // debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_country(val)
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
            action: "GolfTourney_Email_Notifications_update_country_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_country = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_geo.country = val;
            } else
            {
                wp_updated.profile_country = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_country = "false";
           // alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_zip(val)
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
            action: "GolfTourney_Email_Notifications_update_zip_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_zip = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_geo.postal = val;
            } else
            {
                wp_updated.profile_zip = "false";
                //alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_zip = "false";
           // alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_favformats(val)
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
            action: "GolfTourney_Email_Notifications_update_favformats_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_favformats = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_golf.favformats = val;
            } else
            {
                wp_updated.profile_favformats = "false";
              //  alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_favformats = "false";
           // alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_favbrands(val)
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
            action: "GolfTourney_Email_Notifications_update_favbrands_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_favbrands = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_golf.favorite_brand = val;
            } else
            {
                wp_updated.profile_favbrands = "false";
             //   alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_favbrands = "false";
           // alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}

function update_user_avatar(val)
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
            action: "GolfTourney_Email_Notifications_update_avatar_request",
            newval: val,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            wp_updated.profile_avatar = "true";
            debuger_3 = result;
            if (result[0]) {
                profile_avatar = val;
            } else
            {
                wp_updated.profile_avatar = "false";
              //  alert("Server: Error check debugger 3.");
            }
            return 0;
        },
        error: function (result) {
            wp_updated.profile_avatar = "false";
           // alert("Client: Error check debugger 3.");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}
function contactEvent(id,who,name,email,phone,message)
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
            action: "GolfTourney_Email_Notifications_contact_event_request",
            id: id,
            who: who,
            name: name,
            email: email,
            phone: phone,
            message: message,
            user: getCookie("user"),
            pass: getCookie("pass")
        },
        success: function (result) {
            debuger_3 = result;
            $("#contact-submit").prop('disabled', false);
            if (result[0]) {
                $("#contact-form").css("display", "none");
                $("#contact-response").html("<h1>Thanks!  The tournament provider will be notified about your request and may be reaching out to provide you with more information in the next couple days.</h1>");
            } else
            {
                alert("Message Failed!!!");
            }
            return 0;
        },
        error: function (result) {
            $("#contact-submit").prop('disabled', false);
            alert("Message Failed!!!");
            debuger_3 = result;
            return 1;
        },
        timeout: 60000
    });
}
