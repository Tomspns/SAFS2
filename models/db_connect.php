<?php
function dbConnect() {
    $dsn = 'mysql:host=localhost;dbname=double_verification;charset=utf8';
    $username = 'root';
    $password = '';

    try {
        return new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
    } catch (PDOException $e) {
        die('Erreur : ' . $e->getMessage());
    }
}
?>
