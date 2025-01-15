<?php
require_once('models/user.php');

function processSignup() {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $faceDescriptor = $_POST['faceDescriptor'];

    try {
        // Vérifier que tous les champs sont remplis
        if (empty($username) || empty($email) || empty($password) || empty($faceDescriptor)) {
            throw new Exception("Tous les champs sont obligatoires.");
        }

        // Valider l'e-mail
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Adresse e-mail invalide.");
        }

        // Valider le mot de passe
        if (!preg_match('/^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/', $password)) {
            throw new Exception("Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.");
        }

        // Hasher le mot de passe
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Appeler createUser
        if (createUser($username, $email, $hashedPassword, $faceDescriptor)) {
            require("views/loginForm.php");
        }
    } catch (Exception $e) {
        // Afficher un message d'erreur spécifique
        $error = $e->getMessage();
        require("views/error.php");
    }
}


?>
