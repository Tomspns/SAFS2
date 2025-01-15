document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton');
    const closeOverlayButton = document.getElementById('closeOverlay');
    const overlay = document.getElementById('faceScanOverlay');
    const video = document.getElementById('video');
    const faceDescriptorInput = document.getElementById('faceDescriptor');
    const scanFeedback = document.getElementById('scanFeedback');
    const tutorialIcon = document.getElementById('tutorialIcon');
    const submitButton = document.getElementById('submitButton');
    const passwordInput = document.getElementById('password');
    const passwordFeedback = document.createElement('div');
    let intervalId = null;
    let movementStage = 0;
    let initialX = null;

    // Ajouter des styles pour les conditions du mot de passe
    passwordFeedback.innerHTML = `
        <ul style="list-style: none; padding: 0; margin-top: 10px;">
            <li style="color: gray; font-size: 0.9em;">✔️ Au moins <strong>8 caractères</strong></li>
            <li style="color: gray; font-size: 0.9em;">✔️ Une lettre <strong>majuscule</strong></li>
            <li style="color: gray; font-size: 0.9em;">✔️ Une lettre <strong>minuscule</strong></li>
            <li style="color: gray; font-size: 0.9em;">✔️ Un <strong>chiffre</strong></li>
            <li style="color: gray; font-size: 0.9em;">✔️ Un caractère spécial (<strong>@, #, $, etc.</strong>)</li>
        </ul>`;
    passwordInput.parentNode.insertBefore(passwordFeedback, passwordInput.nextSibling);

    // Désactiver le bouton "Créer un compte" par défaut
    submitButton.style.display = "none";

    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;

            await new Promise((resolve) => {
                video.onloadeddata = () => resolve();
            });
            console.log("Caméra activée.");
        } catch (error) {
            console.error("Erreur d'accès à la webcam :", error);
            alert("Impossible d'accéder à la webcam. Vérifiez vos permissions.");
        }
    }

    function stopVideo() {
        const stream = video.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        video.srcObject = null;

        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    async function loadModels() {
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/repertoire/faceID/assets/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/repertoire/faceID/assets/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/repertoire/faceID/assets/models');
            console.log("Modèles chargés avec succès.");
        } catch (error) {
            console.error("Erreur lors du chargement des modèles :", error);
            alert("Impossible de charger les modèles.");
        }
    }

    function updateScanFeedback(stage) {
        const feedbackTexts = [
            "Restez immobile.",
            "Tournez légèrement la tête à gauche.",
            "Tournez légèrement la tête à droite.",
            "Scan réussi !"
        ];
        const icons = ["🙅‍♂️", "👈🙂", "👉🙂", "✅"];

        scanFeedback.textContent = feedbackTexts[stage] || "";
        tutorialIcon.textContent = icons[stage] || "";
    }

    async function startFaceDetection() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        video.parentElement.appendChild(canvas);
        const context = canvas.getContext('2d');

        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        updateScanFeedback(0); // Demande de rester immobile

        intervalId = setInterval(async () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!video.videoWidth || !video.videoHeight) return; // Assurer que la vidéo est prête

            const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                const resizedDetections = faceapi.resizeResults(detection, displaySize);
                const landmarks = resizedDetections.landmarks;

                // Inverser les points pour compenser l'inversion
                landmarks.positions.forEach((point) => {
                    const invertedX = canvas.width - point.x; // Calculer l'inversion
                    context.beginPath();
                    context.arc(invertedX, point.y, 2, 0, Math.PI * 2);
                    context.fillStyle = "red";
                    context.fill();
                });

                const nose = landmarks.getNose()[0];
                const invertedNoseX = canvas.width - nose.x;

                if (initialX === null) {
                    initialX = invertedNoseX;
                    updateScanFeedback(1);
                } else if (movementStage === 0 && invertedNoseX < initialX - 20) {
                    movementStage = 1;
                    updateScanFeedback(2);
                } else if (movementStage === 1 && invertedNoseX > initialX + 20) {
                    movementStage = 2;
                    updateScanFeedback(3);

                    clearInterval(intervalId);
                    stopVideo();

                    faceDescriptorInput.value = JSON.stringify(detection.descriptor);
                    console.log("Descripteur facial généré :", faceDescriptorInput.value);

                    scanButton.style.display = "none";
                    submitButton.style.display = "inline-block";

                    // Fermer l'overlay après une seconde
                    setTimeout(() => {
                        overlay.style.display = 'none';
                        scanFeedback.textContent = "";
                        tutorialIcon.textContent = "";
                        canvas.remove();
                    }, 1000);
                }
            } else {
                scanFeedback.textContent = "Aucun visage détecté. Ajustez votre position.";
            }
        }, 100);
    }

    scanButton.addEventListener('click', async () => {
        overlay.style.display = 'flex';
        initialX = null;
        movementStage = 0;
        await loadModels();
        await startVideo();
        startFaceDetection();
    });

    closeOverlayButton.addEventListener('click', () => {
        stopVideo();
        overlay.style.display = 'none';
        scanFeedback.textContent = "";
        tutorialIcon.textContent = "";
    });
});
