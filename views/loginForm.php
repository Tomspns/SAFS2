<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion avec Face ID</title>
    <link rel="stylesheet" href="assets/css/login.css">
</head>
<body>
    <div class="background-container"></div> <!-- Fond dynamique -->

    <div class="form-container artistic">
        <div class="form-header">
            <h1>Connexion</h1>
            <p>Connectez-vous avec votre mot de passe et votre scan facial.</p>
        </div>
        <form action="index.php?action=process_login" method="post" id="loginForm">
            <div class="form-group">
                <label for="email">Adresse e-mail</label>
                <input type="email" id="email" name="email" placeholder="Votre e-mail" required>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" placeholder="Votre mot de passe" required>
            </div>
            <div class="form-group">
                <button type="button" id="startScan" class="btn-secondary">Scanner votre visage</button>
                <span id="scanSuccessMessage" style="display: none;">Visage vérifié avec succès !</span>
            </div>
            <input type="hidden" id="faceDescriptor" name="faceDescriptor">
            <button type="submit" class="btn-primary" id="submitButton" disabled>Se connecter</button>
            <p id="errorMessage" style="color: red; display: none; margin-top: 10px;">Vous devez vérifier votre visage avant de vous connecter.</p>
        </form>
        <p>Pas encore inscrit ? <a href="index.php?action=signup">Créer un compte</a></p>
    </div>

    <!-- Overlay pour le scan facial -->
    <div id="faceScanOverlay" class="overlay" style="display: none;">
        <div class="overlay-content">
            <h2 style="color: white;">Scan en cours</h2>
            <p id="scanFeedback" class="dynamic-text">Initialisation du scan... Veuillez patienter.</p>
            <!-- Conteneur vidéo -->
            <div id="video-container">
                <video id="video" autoplay muted></video>
            </div>
            <div id="tutorialIcon" style="font-size: 2rem; text-align: center; margin-top: 10px;">🙂</div>
            <button id="closeOverlay" class="btn-secondary">Fermer</button>
        </div>
    </div>

    <script src="assets/js/face-api.min.js"></script>
    <script src="assets/js/login.js"></script>
</body>
</html>
