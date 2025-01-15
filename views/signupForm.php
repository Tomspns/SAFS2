<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription avec Face ID</title>
    <link rel="stylesheet" href="/repertoire/faceID/assets/css/styles.css">
</head>
<body>
    <div class="background-container"></div> <!-- Fond dynamique -->

    <div class="form-container artistic">
        <div class="form-header">
            <h1>Rejoignez-nous</h1>
            <p>Inscrivez-vous facilement et sécurisez votre compte avec un scan facial.</p>
        </div>
        <form action="index.php?action=process_signup" method="post" id="signupForm">
            <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
                <input type="text" id="username" name="username" placeholder="Votre nom d'utilisateur" required>
            </div>
            <div class="form-group">
                <label for="email">Adresse e-mail</label>
                <input type="email" id="email" name="email" placeholder="Votre e-mail" required>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" placeholder="Votre mot de passe" required>
                <div id="passwordRequirements" style="margin-top: 10px;"></div>
            </div>
            <div class="form-group">
                <button type="button" id="scanButton" class="btn-secondary">Scanner votre visage</button>
                <span id="scanSuccessMessage" style="display: none;">Visage scanné avec succès !</span>
            </div>
            <input type="hidden" id="faceDescriptor" name="faceDescriptor">
            <button type="submit" class="btn-primary" id="submitButton">Créer un compte</button>
            <p id="errorMessage" style="color: red; display: none; margin-top: 10px;">Vous devez scanner votre visage avant de créer un compte.</p>
        </form>

        <!-- Lien vers la page de connexion -->
        <p style="text-align: center; margin-top: 20px;">
            <a href="index.php?action=login_form" style="color: #007BFF; text-decoration: none;">Déjà inscrit ? Se connecter.</a>
        </p>
    </div>

    <!-- Overlay pour le scan facial -->
    <div id="faceScanOverlay" class="overlay">
        <div class="overlay-content">
            <h2 style="color: white;">Scan en cours</h2>
            <p id="scanFeedback" class="dynamic-text">Initialisation du scan... Veuillez patienter.</p>
            <!-- Conteneur vidéo -->
            <div id="video-container">
                <video id="video" autoplay muted></video>
            </div>
            <button id="closeOverlay" class="btn-secondary">Fermer</button>
            <div id="tutorialIcon" style="font-size: 2rem; text-align: center; margin-top: 10px;"></div>
        </div>
    </div>

    <script src="/repertoire/faceID/assets/js/face-api.min.js"></script>
    <script src="/repertoire/faceID/assets/js/face-id.js"></script>
</body>
</html>
