<?php
// config.php - Database connection & session configurations
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

$db_host = 'localhost';
$db_name = 'elearning_db';
$db_user = 'root';
$db_pass = ''; // Default XAMPP MySQL password is empty

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database Connection Failed: " . $e->getMessage());
}
?>
