// Copyright 2021 Gavin Pease
let zoneStatus = "";
let systemEnabled;
let loadTable = true;
let systemUUID = "";
let sprinklerSystemAPI = "";
let sprinklerZoneAPI = "";
let userUUID = "";

function getSystemUUID(myFunc) {
    userUUID = $.cookie('pimationuseruuid');
    $.get('https://api.peasenet.com/sprinkler/user/' + userUUID).done(function (data) {
        systemUUID = JSON.parse(data)[0]["deviceUUID"];
        sprinklerSystemAPI = 'https://api.peasenet.com/sprinkler/systems/' + systemUUID;
        sprinklerZoneAPI = 'https://api.peasenet.com/sprinkler/zone/' + systemUUID;
        myFunc();
    });
}

function getZoneData() {
    $.get(sprinklerSystemAPI + '/status').done(function (data) {
        systemEnabled = JSON.parse(data)["systemenabled"];
        if (systemEnabled) {
            $("#schedule").html("On");
            $("#schedule-btn-txt").html("Enabled");
            $("#schedule-btn").removeClass("systemoff").addClass("systemon");
        } else {
            $("#schedule-btn").removeClass("systemon").addClass("systemoff");
            $("#schedule").html("Off");
            $("#schedule-btn-txt").html("Disabled");
        }
    });
    $.get(sprinklerZoneAPI + '/status').done(function (data) {
        zoneStatus = JSON.parse(data);
        if (loadTable)
            buildZoneTable();
        loadTable = false;
    });
}

function updateZoneTable() {
    setInterval(function () {
        getZoneData();
        let button_id;
        let name_id, i;
        for (i = 0; i < zoneStatus.length; i++) {
            button_id = zoneStatus[i]["gpio"];
            name_id = !zoneStatus[i]["status"] ? "On" : "Off";
            document.getElementById("status-button-" + i).innerHTML = name_id;
            if (name_id === "Off")
                $("#" + button_id).removeClass("systemoff").addClass("systemon");
            else
                $("#" + button_id).removeClass("systemon").addClass("systemoff");
        }
    }, 1000);
}

$(document).ready(function () {
    getSystemUUID(function () {
        console.log("got uuid");
    });
    $("#menuopen").click(function () {
        $("#menuopen").fadeOut(250, function () {
            $('#menunav').fadeIn(250);
        });
    });
    $("#menuclose").click(function () {
        $('#menunav').fadeOut(250, function () {
            $("#menuopen").fadeIn(250);
        });
    });
    $("#schedule-btn").click(function () {
        $.post(sprinklerSystemAPI + "/toggle", {systemtoggle: true});
    });
    $("#update").click(function () {
        console.log("Sent update request...");
        $("button").attr("disabled", "disabled");
        $.get('lib/api.php?update').done(function (data) {
            console.log("Response -> " + data);
            $("#notification-text").html("Done checking for updates. Check log for more information.");
            $("#notification").fadeIn("slow");
            $(".dismiss").click(function () {
                $("#notification").fadeOut("slow");
                $("button").removeAttr("disabled");
            });
        });
    });
});

function buildZoneTable() {
    let tr = "";
    for (let i = 0; i < zoneStatus.length; i++) {
        let zoneData = zoneStatus[i];
        let name = zoneData['name'];
        let gpio = zoneData['gpio'];
        let enabled = zoneData['enabled'] ? "" : "unscheduled";
        let autooff = zoneData['autooff'] ? "" : "italic"
        let on = zoneData['status'] ? "Off" : "On";
        let zoneCss = zoneData['status'] ? "systemon" : "systemoff";
        tr += "<tr><td><div class='sprinkler-info'><p class='sprinkler-name " + autooff + " " + enabled + "'>Zone " + (i + 1) + "</p>"
        tr += "<p> " + name + " </p></div></td>"
        tr += "<td><div class='sprinkler-button'><button id='" + gpio + "' name='toggle' onclick='sendData(" + i + ");";
        tr += " return false' class='w3-button " + zoneCss + " w3-round-xxlarge mybutton w3-center'>"
        tr += "Turn <span id='status-button-" + i + "'>" + on + "</span></button> </div></td></tr>"
    }
    $("#sprinklerData").append(tr).fadeIn(250);

}

function sendData(index) {
    const toggle = ((zoneStatus[index]["status"]) ? "off" : "on");
    let gpio = zoneStatus[index]["gpio"];
    $.post(sprinklerZoneAPI + '/' + gpio + '/' + toggle).done(function (returns) {
        console.log(returns);
    });
}



