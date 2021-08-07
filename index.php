<!-- Copyright 2021 Gavin Pease -->
<?php

include_once('lib/cookie_check.php');
?>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SQLSprinkler</title>
    <link href="css/w3.css" type="text/css" rel="stylesheet"/>
    <link href="css/w3-flat.css" type="text/css" rel="stylesheet"/>
    <link href="css/style.css" type="text/css" rel="stylesheet"/>
    <script src="https://kit.fontawesome.com/e00a151875.js" crossorigin="anonymous"></script>
    <script src="https://www.gstatic.com/firebasejs/ui/4.8.1/firebase-ui-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-analytics.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-firestore.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="js/jquery.js"></script>
    <script src="../../lib/auth.js"></script>
    <script src="../../lib/urlparam.js"></script>
    <script type="text/javascript"
            src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
    <script src="js/sprinkler.js"></script>
</head>
<body onload="updateZoneTable();" class="w3-light-gray">
<div>
    <br>
    <table class="w3-table w3-table-all sprinkler-table w3-threequarter w3-display-topmiddle sprinkler-table"
           id="sprinklerData">
        <div id="notification" style="display: none;font-size: .75em;padding:16px;z-index: 100"
             class="w3-card-4 w3-white w3-display-middle">
            <span id="notification-text"></span>
            <span class="w3-button dismiss w3-red" style="float:right;"><i class="fas fa-times"></i></span>
        </div>
        <tr>
            <td>
                <div class="w3-rest" style="float:left;">
                    <p style="font-weight: bold">System Schedule</p>
                </div>
            </td>
            <td>
                <button id="schedule-btn"
                        class="w3-button programoff w3-round-xxlarge w3-centered mybutton sprinkler-button">
                    <span id="schedule-btn-txt">Off</span>
                </button>
            </td>
        </tr>
    </table>
</div>
<div class="w3-display-bottomleft w3-center w3-flat-silver w3-dropdown-hover " style="position:fixed;">
    <a href="javascript:void(0);" id="menuopen" class="w3-button fix-bars">
        <i style="z-index: 5;" class="fa fa-bars w3-display-middle"></i>
    </a>
    <div style="display: none;" id="menunav">
        <a id="menuclose" class="w3-button "> <i style="z-index: 5;" class="fa fa-times"></i></a>
        <a href="/" class="w3-button"><i style="z-index: 5;" class="fa fa-home"></i></a>
        <a href="settings" class="w3-button"><i style="z-index: 5;" class="fa fa-gears"></i></a>
        <a id="update" class="w3-button"><i style="z-index: 5;" class="fas fa-download"></i></a>
    </div>
</div>
</body>
</html>
