function showSearchMenu()
{
    $(".window").removeClass("window-shown").addClass("window-hidden");
    $("#search").removeClass("window-hidden").addClass("window-shown");
    
    if (wp_loaded.event_categories === "false")
    {
        var load_list = ["event_categories", "profile_geo", "profile_personal"];
        //Load the categories.
        load_needed_objects(load_list);
    }

    //Set default date values.
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#startdate').val(today);
    now.setMonth(now.getMonth()+1);
    day = ("0" + now.getDate()).slice(-2);
    month = ("0" + (now.getMonth() + 1)).slice(-2);
    var future = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#enddate').val(future);

    //Set range display to current value.
    $('#rangetext').text($('#range').val()+"(miles)");
}
function showAlertsMenu()
{
    $(".menu-item").removeClass("active");
    $("#alerts-button").addClass("active");
    $(".window").removeClass("window-shown").addClass("window-hidden");
    $("#alerts").removeClass("window-hidden").addClass("window-shown");
}
function showGolfersMenu()
{
    if (wp_loaded.event_categories === "false")
    {
        var load_list = ["event_categories"];
        //Load the categories.
        load_needed_objects(load_list);
    }
    $(".menu-item").removeClass("active");
    $("#golfers-button").addClass("active");
    $(".window").removeClass("window-shown").addClass("window-hidden");
    $("#golfers").removeClass("window-hidden").addClass("window-shown");
}
function showProfileMenu()
{
    $(".window").removeClass("window-shown").addClass("window-hidden");
    $("#profile").removeClass("window-hidden").addClass("window-shown");
    
    var load_list = [];

    if (wp_loaded.profile_personal === "false")
    {
        load_list.push("profile_personal");
    }
    if (wp_loaded.profile_geo === "false")
    {
        load_list.push("profile_geo");
    }
    if (wp_loaded.profile_golf === "false")
    {
        load_list.push("profile_golf");
    }
    if (wp_loaded.profile_avatar === "false")
    {
        load_list.push("profile_avatar");
    }
    if (load_list.length > 0)
    {
        //Load the needed data.
        load_needed_objects(load_list);
    }
}
function showUpdateProfileMenu()
{
    var load_list = [];

    if (wp_loaded.profile_personal === "false")
    {
        load_list.push("profile_personal");
    }
    if (wp_loaded.profile_geo === "false")
    {
        load_list.push("profile_geo");
    }
    if (wp_loaded.profile_golf === "false")
    {
        load_list.push("profile_golf");
    }
    if (wp_loaded.profile_avatar === "false")
    {
        load_list.push("profile_avatar");
    }
    if (load_list.length > 0)
    {
        //Load the needed data.
        load_needed_objects(load_list);
    }
    
    $(".menu-item").removeClass("active");
    $("#profile-button").addClass("active");
    $(".window").removeClass("window-shown").addClass("window-hidden");
    $("#update_profile").removeClass("window-hidden").addClass("window-shown");
}
function showEvent(event)
{
    event = event || false;
    if(event){
        load_event(event);
    }
    $(".window").removeClass("window-shown").addClass("window-hidden");
    $("#event").removeClass("window-hidden").addClass("window-shown");
    $('html,body').scrollTop(0);
}
