// Copyright 2021 Gavin Pease

function getZoneData() {
    getSystemUUID(function () {
        $.get(sprinklerZoneAPI + '/status').done(function (data) {
            zoneStatus = JSON.parse(data);
            buildZoneTable();
            updateZoneTable();
            console.log("Done receiving sprinkler data.");
            $("#settings-table").delay(100).fadeIn(250);
        });
    });
}

$(document).ready(function () {
    loadTable = true;
    window.deleteMode = false;
    getZoneData();
    $('#settings-table').sortable();
    $('#settings-table').sortable("option", {disabled: true, update: onReorder});
});

$.postJSON = function (url, data, callback) {
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': JSON.stringify(data),
        'dataType': 'json',
        'async': true,
        'success': callback(),
        error: function (xhr, error) {
            console.debug(xhr);
            console.debug(error);
        },
    });
};

function getData(id, add) {
    $("#settings-table").fadeOut(500);
    if (add) {
        window.addMode = true;
        $("#zone-name").val('');
        $("#zone-gpio").val('');
        $("#zone-runtime").val('');
        $("#zone-enabled").attr('checked', true);
        $("#zone-autooff").attr('checked', true);
    } else {
        setTimeout(function () {
            $("#zone-name").val(zoneStatus[id]["name"]);
            $("#zone-gpio").val(zoneStatus[id]["gpio"]);
            $("#zone-runtime").val(zoneStatus[id]["time"]);
            $("#zone-id").val(zoneStatus[id]["id"]);
            $("#zone-number").val(id);
            $("#zone-delete").val(id);
            $("#zone-enabled").prop("checked", zoneStatus[id]["enabled"]);
            $("#zone-autooff").prop("checked", zoneStatus[id]["auto_off"]);
            console.log(zoneStatus[id]["id"]);
            window.addMode = false;
        }, 250);
    }
    $("#edit").delay(100).fadeIn(500);
}

function submitChanges() {
    let id = $("#zone-id").val();
    let runtime = $("#zone-runtime").val();
    let zonename = $("#zone-name").val();
    let gpio = $("#zone-gpio").val();
    let scheduled = $("#zone-enabled").prop('checked');
    let autooff = $("#zone-autooff").prop('checked');
    let order = $("#zone-number").val();
    if (runtime === "")
        runtime = 10;
    if (zonename === "")
        zonename = "Change me";

    let addMode = window.addMode;
    let deleteMode = window.deleteMode;
    let data;
    if (gpio === "" || gpio > 40) {
        alert("You must set a proper GPIO pin!");
        return;
    }
    let callback = sprinklerZoneAPI + "/update";
    //{
    //     "name": "Rust-Zone 123",
    //     "gpio": 12,
    //     "time": 10,
    //     "auto_off": true,
    //     "enabled": true,
    //     "system_order": 1,
    //     "id": 4
    // }
    data = {
        "name": zonename,
        "gpio": parseInt(gpio),
        "time": parseInt(runtime),
        "auto_off": Boolean(autooff),
        "enabled": Boolean(scheduled),
        "system_order": parseInt(order),
        "id": parseInt(id)
    };
    if(addMode){
        callback = sprinklerZoneAPI + "/add";
        data = {
            "name": zonename,
            "gpio": parseInt(gpio),
            "time": parseInt(runtime),
            "auto_off": Boolean(autooff),
            "enabled": Boolean(scheduled)
        }
    }
    if(deleteMode) {
        callback = sprinklerZoneAPI + "/delete";
        data = {
            "id": parseInt(id)
        }
    }
    $.postJSON(callback, data, function () {
        setTimeout(function () {
            getZoneData();
            fadeEditOut();
        }, 250)
    });
}

function fadeEditOut() {
    $("#edit").fadeOut(500);
    $("#settings-table").fadeIn(500);
}

function createEditRow(index) {
    let tr = "";
    let id = zoneStatus[index]['id'];
    let enabled = zoneStatus[index]['enabled'] ? "" : "unscheduled";
    let autooff = zoneStatus[index]['auto_off'] ? "" : "italic"
    tr += "<tr class='" + enabled + " " + autooff + " draggable'  zoneindex='" + index + "' zoneid='" + id + " '> ";
    tr += "<td id='zone-" + id + "-index'></td>";
    tr += "<td id='zone-" + id + "-name' class='w3-hide-small'></td>";
    tr += "<td id='zone-" + id + "-time'></td>";
    tr += "<td>";
    tr += "<button id ='zone-" + id + "-edit' class='w3-button w3-flat-silver w3-round-xlarge' value='" + index + "'>Edit</button>";
    tr += "</td>";
    tr += "</tr>";
    return tr;
}

function disableEditing() {
    $('#settings-table').sortable("option", {disabled: true});
    $("#edit-order").removeClass('w3-green w3-hover-green');
}

function enableEditing() {
    if ($("#edit-order").hasClass('w3-green')) {
        disableEditing();
        return;
    } else {
        $('#settings-table').sortable("option", {disabled: false, update: onReorder});
        $("#edit-order").addClass('w3-green w3-hover-green');
    }
}

function setButtonListener() {
    $("button").unbind().click(function () {
        let editMode = $(this).attr("id").indexOf('edit') > -1;
        let deleteMode = $(this).attr("id").indexOf('delete') > -1;
        let val = $(this).val();
        if (editMode)
            getData(val, false);
        else if (deleteMode) {
            var wantsToDelete = confirm("Are you sure you want to delete zone " + (parseInt(val) + 1) + "?");
            if (!wantsToDelete)
                return;
            window.deleteMode = true;
            submitChanges();
        }
    });
    $("#settings-submit").click(submitChanges);
    $("#add").click(function () {
        getData(-1, true);
    });
    $("#back").click(fadeEditOut);
    $("#edit-order").click(enableEditing);
}

function buildZoneTable() {
    $("#settings-table").html('<thead><tr class="nodrag"><th>Zone</th><th class="w3-hide-small">Name</th><th>Run Time</th><th>Actions</th></tr></thead>');
    updateZoneTable();
    setButtonListener();
}

function onReorder() {
    let table_json = [];
    let counter = 0;
    $(".draggable").each(function () {
        zoneStatus[$(this).attr('zoneindex')]["system_order"] = counter;
        counter++;
    });
    console.log(zoneStatus);
    for (let i = 0; i < zoneStatus.length; i++) {
        table_json.push(zoneStatus[i]["system_order"]);
    }
    console.log(table_json);
    postdata = {
        order: table_json
    }
    console.log(postdata);
    $.postJSON(sprinklerZoneAPI + "/reorder", postdata, function () {
        $("#settings-table").fadeOut(250);
        setTimeout(function () {
            getZoneData();
            updateZoneTable();
            $("#settings-table").fadeIn(250);
        }, 1000);
    });
}

function updateZoneTable() {
    for (let i = 0; i < zoneStatus.length; i++) {
        let currSprinkler = zoneStatus[i];
        let currName = currSprinkler['name'];
        let currTime = currSprinkler['time'];
        let currZone = i + 1;
        let id = currSprinkler['id'];
        let zoneExists = $("#zone-" + id + "-index").length !== 0;
        if (!zoneExists)
            $("#settings-table").append(createEditRow(i));
        $("#zone-" + id + "-index").html(currZone);
        $("#zone-" + id + "-name").html(currName);
        $("#zone-" + id + "-time").html(currTime);
    }
}