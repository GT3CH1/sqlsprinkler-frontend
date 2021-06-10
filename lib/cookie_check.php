<?php

session_start();
if(!isset($_COOKIE['pimationuseruuid']) || !isset($_COOKIE['loggedIn']) || !isset($_SESSION['UserUUID']))
    header("Location: /login.php");