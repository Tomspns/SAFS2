document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton');
    const closeOverlayButton = document.getElementById('closeOverlay');
    const overlay = document.getElementById('faceScanOverlay');
    const video = document.getElementById('video');
    const faceDescriptorInput = document.getElementById('faceDescriptor');
    const scanFeedback = document.getElementById('scanFeedback');
    const tutorialIcon = document.getElementById('tutorialIcon');
    const submitButton = document.getElementById('submitButton');
    const errorMessage = document.getElementById('errorMessage');
    let canvas = null;
    let intervalId = null;
    let movementStage = 0;
    let initialX = null;
    let faceDetected = false;

    // Désactiver le bouton "Créer un compte" par défaut
    submitButton.disabled = true;

    submitButton.addEventListener('click', (e) => {
        if (!faceDescriptorInput.value) {
            e.preventDefault();
            errorMessage.style.display = "block";
            setTimeout(() => (errorMessage.style.display = "none"), 5000);
        }
    });

    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;

            // Attendre que la vidéo soit prête avant de continuer
            await new Promise((resolve) => {
                video.onloadeddata = () => resolve();
            });
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

        if (canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

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

    function syncCanvasWithVideo() {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.top = video.offsetTop + 'px';
            canvas.style.left = video.offsetLeft + 'px';
            video.parentElement.appendChild(canvas);
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    function updateScanFeedback(stage) {
        if (stage === 0) {
            scanFeedback.textContent = "Veuillez rester immobile pendant que nous analysons votre visage.";
            tutorialIcon.textContent = "🙅‍♂️"; // Émoji pour ne pas bouger
        } else if (stage === 1) {
            scanFeedback.textContent = "Tournez votre visage lentement vers la gauche.";
            tutorialIcon.textContent = "🙂👈"; // Émoji pour tourner à droite
        } else if (stage === 2) {
            scanFeedback.textContent = "Tournez maintenant votre visage lentement vers la droite.";
            tutorialIcon.textContent = "👉🙂"; // Émoji pour tourner à gauche
        } else if (stage === 3) {
            scanFeedback.textContent = "Scan réussi !";
            tutorialIcon.textContent = "✅"; // Émoji pour validation
        }
    }

    function detectFaceTurn(landmarks) {
        const nose = landmarks.getNose()[0];

        if (initialX === null) {
            initialX = nose.x;
            updateScanFeedback(1); // Tourner à droite
            return false;
        }

        if (movementStage === 0 && nose.x > initialX + 30) {
            movementStage = 1;
            updateScanFeedback(2); // Tourner à gauche
            return false;
        }

        if (movementStage === 1 && nose.x < initialX - 30) {
            movementStage = 2;
            updateScanFeedback(3); // Scan réussi
            return true;
        }

        return false;
    }

    async function startFaceDetection() {
        syncCanvasWithVideo();
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        const context = canvas.getContext('2d');
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        updateScanFeedback(0); // Demande de rester immobile

        intervalId = setInterval(async () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks().withFaceDescriptor();

            if (detection) {
                const resizedDetections = faceapi.resizeResults(detection, displaySize);
                const { landmarks } = resizedDetections;

                landmarks.positions.forEach((point) => {
                    context.beginPath();
                    context.arc(point.x, point.y, 2, 0, Math.PI * 2);
                    context.fillStyle = "magenta";
                    context.fill();
                });

                if (!faceDetected) {
                    faceDetected = true;
                    updateScanFeedback(1); // Première étape : tourner à droite
                }

                if (movementStage < 2 && detectFaceTurn(landmarks)) {
                    faceDescriptorInput.value = JSON.stringify(detection.descriptor);
                    console.log("Descripteur facial généré :", faceDescriptorInput.value);

                    scanButton.textContent = "Visage scanné";
                    scanButton.style.backgroundColor = "gray";
                    scanButton.disabled = true;

                    submitButton.disabled = false; // Activer le bouton de soumission
                    clearInterval(intervalId);

                    setTimeout(() => {
                        stopVideo();
                        overlay.style.display = 'none'; // Fermer la fenêtre du scan
                        scanFeedback.textContent = ""; // Réinitialiser le texte
                        tutorialIcon.textContent = "";
                    }, 1000); // Attendre une seconde avant de fermer
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
        faceDetected = false;
        await startVideo();
        await loadModels();
        startFaceDetection();
    });

    closeOverlayButton.addEventListener('click', () => {
        stopVideo();
        overlay.style.display = 'none';
        scanFeedback.textContent = ""; // Réinitialiser le texte
        tutorialIcon.textContent = "";
    });
});
