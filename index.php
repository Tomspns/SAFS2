<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require_once('controllers/register.php');
require_once('controllers/login.php');

if (isset($_GET["action"])) {
    switch ($_GET["action"]) {
        case "login_form":
            require("views/loginForm.php");
            break;

        case "signup":
            require("views/signupForm.php");
            break;

        case "process_signup":
            processSignup();
            break;

        case "process_login":
            processLogin();
            break;

        default:
            echo "Action inconnue.";
            require("views/mainMenu.php");
            break;
    }
} else {
    require("views/mainMenu.php");
}
