<?php
header('Content-Type: application/json');
require_once '../models/db_connect.php';

// Récupérer les données JSON envoyées
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['faceDescriptor']) && isset($_SESSION['email'])) {
    $faceDescriptor = json_decode($data['faceDescriptor']); // Convertir en tableau PHP
    $email = $_SESSION['email']; // Utilisateur authentifié (email de la session)

    try {
        // Récupérer le descripteur facial enregistré pour l'utilisateur
        $query = $pdo->prepare("SELECT face_descriptors FROM face_recognition_data 
                                INNER JOIN users ON face_recognition_data.user_id = users.user_id 
                                WHERE users.email = :email");
        $query->execute(['email' => $email]);
        $storedDescriptor = $query->fetchColumn();

        if ($storedDescriptor) {
            $storedDescriptor = json_decode($storedDescriptor); // Convertir en tableau PHP
            $distance = 0;

            // Calcul de la distance euclidienne
            for ($i = 0; $i < count($faceDescriptor); $i++) {
                $distance += pow($faceDescriptor[$i] - $storedDescriptor[$i], 2);
            }
            $distance = sqrt($distance);

            // Comparer avec le seuil de reconnaissance
            if ($distance < 0.6) { // Seuil de tolérance (0.6 par défaut)
                echo json_encode(['success' => true, 'message' => 'Reconnaissance réussie']);
                exit;
            }
        }

        // Si la reconnaissance échoue
        echo json_encode(['success' => false, 'message' => 'Visage non reconnu']);
        exit;

    } catch (PDOException $e) {
        // Gestion des erreurs
        echo json_encode(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()]);
        exit;
    }
}

// Si les données requises ne sont pas envoyées
echo json_encode(['success' => false, 'message' => 'Données invalides']);
exit;
?>
