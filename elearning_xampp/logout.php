<?php
// logout.php - Terminate user portal session
require_once 'config.php';

$_SESSION = array();

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

session_start();
$_SESSION['flash_message'] = "You have successfully signed out of the portal.";
$_SESSION['flash_type'] = "info";

header("Location: login.php");
exit();
?>
