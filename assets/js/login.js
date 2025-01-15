document.addEventListener('DOMContentLoaded', () => {
    const startScanButton = document.getElementById('startScan');
    const loginButton = document.getElementById('submitButton');
    const overlay = document.getElementById('faceScanOverlay');
    const video = document.getElementById('video');
    const scanFeedback = document.getElementById('scanFeedback');
    const tutorialIcon = document.getElementById('tutorialIcon');
    const faceDescriptorInput = document.getElementById('faceDescriptor');

    let scanCompleted = false;

    // Désactiver et masquer le bouton de connexion par défaut
    loginButton.disabled = true;
    loginButton.style.display = "none";

    // Fonction pour démarrer la caméra
    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            console.log("Caméra activée.");
        } catch (error) {
            console.error("Erreur d'accès à la webcam :", error);
            alert("Impossible d'accéder à la webcam. Vérifiez vos permissions.");
        }
    }

    // Fonction pour arrêter la caméra
    function stopVideo() {
        const stream = video.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;
    }

    // Chargement des modèles de face-api.js
    async function loadModels() {
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/repertoire/faceID/assets/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/repertoire/faceID/assets/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/repertoire/faceID/assets/models');
            console.log("Modèles chargés avec succès.");
        } catch (error) {
            console.error("Erreur lors du chargement des modèles :", error);
            alert("Erreur lors du chargement des modèles de reconnaissance faciale. Réessayez plus tard.");
        }
    }

    // Mise à jour des instructions dynamiques
    function updateScanFeedback(stage) {
        const feedbackTexts = [
            "Veuillez rester immobile et centrer votre visage dans le cadre. 📷",
            "Tournez lentement votre visage légèrement vers la droite pour améliorer le scan. ",
            "Tournez lentement votre visage légèrement vers la gauche pour améliorer le scan. ",
            "Reculez légèrement ou ajustez votre distance. 🔙",
            "Scan réussi ! Vous pouvez continuer. ✅"
        ];
        const icons = ["🙅‍♂️", "👉🙂", "👈🙂", "📏", "✅"];

        scanFeedback.textContent = feedbackTexts[stage] || "";
        tutorialIcon.textContent = icons[stage] || "";
    }

    // Détection faciale
    async function startFaceDetection() {
        let initialX = null;
        let initialY = null;
        let movementStage = 0;

        updateScanFeedback(0); // Instructions initiales

        const intervalId = setInterval(async () => {
            try {
                const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detection) {
                    const landmarks = detection.landmarks;
                    const nose = landmarks.getNose()[0];

                    // Ajuster la distance et la position du visage
                    if (!initialX || !initialY) {
                        initialX = nose.x;
                        initialY = nose.y;
                        updateScanFeedback(1);
                    } else if (movementStage === 0 && nose.x < initialX - 30) {
                        movementStage = 1;
                        updateScanFeedback(2);
                    } else if (movementStage === 1 && nose.x > initialX + 30) {
                        movementStage = 2;
                        updateScanFeedback(3);
                    } else if (movementStage === 2 && Math.abs(nose.y - initialY) > 20) {
                        updateScanFeedback(4); // Ajuster la distance
                    } else if (movementStage === 2) {
                        movementStage = 3;
                        updateScanFeedback(4); // Scan réussi

                        // Scan terminé
                        clearInterval(intervalId);
                        stopVideo();
                        overlay.style.display = 'none';

                        faceDescriptorInput.value = JSON.stringify(detection.descriptor);
                        console.log("Descripteur facial généré :", faceDescriptorInput.value);

                        // Mise à jour des boutons
                        startScanButton.style.display = "none"; // Masquer le bouton de scan
                        loginButton.style.display = "inline-block"; // Afficher le bouton "Se connecter"
                        loginButton.disabled = false; // Activer le bouton de connexion
                    }
                } else {
                    scanFeedback.textContent = "Aucun visage détecté. Ajustez votre position.";
                    tutorialIcon.textContent = "❌";
                }
            } catch (error) {
                console.error("Erreur pendant la détection :", error);
                clearInterval(intervalId);
                stopVideo();
                overlay.style.display = 'none';
                alert("Erreur de détection faciale. Réessayez.");
            }
        }, 150);
    }

    // Démarrer le scan au clic
    startScanButton.addEventListener('click', async () => {
        overlay.style.display = 'flex';
        await loadModels(); // Charger les modèles
        await startVideo(); // Démarrer la caméra
        startFaceDetection(); // Lancer la détection
    });

    // Fermer l'overlay
    document.getElementById('closeOverlay').addEventListener('click', () => {
        stopVideo();
        overlay.style.display = 'none';
        scanFeedback.textContent = "";
        tutorialIcon.textContent = "";
    });
});
