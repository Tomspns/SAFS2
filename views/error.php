<?php
$error = htmlspecialchars($error ?? "Une erreur inconnue s'est produite.");
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erreur</title>
    <link rel="stylesheet" href="assets/css/error.css">
</head>
<body>
    <div class="background-container"></div> <!-- Fond dynamique -->
    <div class="error-container">
        <h1>🚨 Erreur 🚨</h1>
        <p><?php echo $error; ?></p>
        <a href="index.php?action=login" class="btn-primary">Retour au formulaire de connexion</a>
    </div>
</body>
</html>
