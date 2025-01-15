<?php
require 'db_connect.php'; // Inclure la connexion à la base de données

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? null;
    $password = $_POST['password'] ?? null;
    $loginDescriptor = json_decode($_POST['faceDescriptor'] ?? '[]', true);

    if (!$email || !$password || !$loginDescriptor) {
        echo "Erreur : veuillez fournir toutes les informations requises.";
        exit();
    }

    $pdo = dbConnect(); // Connexion à la base de données

    // Rechercher l'utilisateur par email
    $stmt = $pdo->prepare("SELECT password, face_descriptor FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Vérification du mot de passe
        if (password_verify($password, $user['password'])) {
            $storedDescriptor = json_decode($user['face_descriptor'], true);

            // Calcul de la distance euclidienne
            function euclideanDistance($desc1, $desc2) {
                return sqrt(array_sum(array_map(
                    fn($a, $b) => ($a - $b) ** 2,
                    $desc1,
                    $desc2
                )));
            }

            $distance = euclideanDistance($loginDescriptor, $storedDescriptor);

            if ($distance < 0.6) {
                // Connexion réussie
                session_start();
                $_SESSION['user'] = $email;
                header("Location: dashboard.php");
                exit();
            } else {
                echo "Erreur : le visage ne correspond pas.";
            }
        } else {
            echo "Erreur : mot de passe incorrect.";
        }
    } else {
        echo "Erreur : utilisateur non trouvé.";
    }
}
?>
