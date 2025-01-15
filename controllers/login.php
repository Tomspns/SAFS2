<?php
require_once('models/user.php');

function processLogin() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $email = $_POST['email'];
    $password = $_POST['password'];
    $loginDescriptor = json_decode($_POST['faceDescriptor'], true);

    $user = getUserByEmail($email);

    if ($user && password_verify($password, $user['hashed_password'])) {
        $storedDescriptor = json_decode($user['face_descriptors'], true);

        // Fonction pour calculer la distance euclidienne
        function euclideanDistance($desc1, $desc2) {
            return sqrt(array_sum(array_map(
                fn($a, $b) => ($a - $b) ** 2,
                $desc1,
                $desc2
            )));
        }

        $distance = euclideanDistance($loginDescriptor, $storedDescriptor);

        if ($distance < 0.6) {
            $_SESSION['user_id'] = $user['user_id'];
            require('views/success.php');
        } else {
            $error = "Le visage ne correspond pas.";
            require('views/error.php');
        }
    } else {
        $error = "Identifiants incorrects.";
        require('views/error.php');
    }
}
?>
