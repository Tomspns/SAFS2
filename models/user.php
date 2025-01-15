<?php
require_once('db_connect.php');

/**
 * Crée un nouvel utilisateur avec ses informations de connexion et son descripteur facial.
 */
function createUser($username, $email, $hashedPassword, $faceDescriptor) {
    $db = dbConnect();

    try {
        // Valider le descripteur facial
        if (empty($faceDescriptor) || json_decode($faceDescriptor, true) === null) {
            throw new Exception("Le descripteur facial est invalide.");
        }

        // Démarrer une transaction
        $db->beginTransaction();

        // Vérifier si l'e-mail existe déjà
        $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
        $stmt->execute([':email' => $email]);
        if ($stmt->fetchColumn() > 0) {
            throw new Exception("L'adresse e-mail est déjà utilisée.");
        }

        // Insérer l'utilisateur dans la table `users`
        $stmt = $db->prepare("INSERT INTO users (username, email) VALUES (:username, :email)");
        $stmt->execute([':username' => $username, ':email' => $email]);
        $userId = $db->lastInsertId();

        // Insérer le mot de passe dans la table `passwords`
        $stmt = $db->prepare("INSERT INTO passwords (user_id, hashed_password) VALUES (:user_id, :hashed_password)");
        $stmt->execute([':user_id' => $userId, ':hashed_password' => $hashedPassword]);

        // Insérer les descripteurs faciaux dans la table `face_recognition_data`
        $stmt = $db->prepare("INSERT INTO face_recognition_data (user_id, face_descriptors) VALUES (:user_id, :face_descriptors)");
        $stmt->execute([':user_id' => $userId, ':face_descriptors' => $faceDescriptor]);

        // Valider la transaction
        $db->commit();
        return true;
    } catch (Exception $e) {
        // Annuler la transaction en cas d'erreur
        $db->rollBack();
        error_log("Erreur dans 'createUser' : " . $e->getMessage());
        throw $e; // Relancer l'exception pour gestion dans l'appelant
    }
}

/**
 * Récupère les informations de l'utilisateur par e-mail.
 */
function getUserByEmail($email) {
    $db = dbConnect();

    $stmt = $db->prepare("
        SELECT 
            u.user_id, 
            u.username, 
            p.hashed_password, 
            f.face_descriptors 
        FROM users u 
        JOIN passwords p ON u.user_id = p.user_id 
        JOIN face_recognition_data f ON u.user_id = f.user_id 
        WHERE u.email = :email
    ");

    $stmt->execute([':email' => $email]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
?>
