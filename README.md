# SAFS2
Challenge IA

Le projet SAFS (Système d'Authetification Faciale Sécurisé) à comme objectif premier de sécuriser les accès tout en garantissant une expérience utilisateur rapide et fiable.
Le fonctionnement du système se présente ainsi :

CAPTURE D'IMAGES :
- Activation de la caméra : l'utilisateur accède au service et autorise l'utilisation de sa caméra sur son appareil.
- Capture en temps réel : prise d'une image ou d'une courte vidéo.
- Vérifications initiales : qualité d'éclairage et position correcte détectées automatiquement.

PRETRAITEMENT DES DONNEES :
- Détection et isolement du visage : séparation du visage par rapport au fond de l'image.
- Extraction des caractéristiques : analyse des traits uniques comme la distance entre les yeux, la forme du nez et la structure faciale.
- Conversion en données biométriques : transformation des caractéristiques en vecteurs numériques exploitables par l'IA.

COMPRAISON AVEC LES DONNEES ENREGISTREES :
- Les traits extraits sont analysés.
- Une base de données sécurisée est utilisée.
- Algorithmes avancés de reconnaissance faciale.

DETECTION D'USURPATION (ANTI-SPOOFING) :
- Détection de profondeur pour vérifier le 3D.
- Vérification des mouvements : cligner des yeux, sourire.
- Analyse thermique ou UV pour plus de précision.

VALIDATION ET ACCES SECURISE :
- Sécurité garantie à chaque étape.
- Données cryptées pour éviter les fuites.
- Modèles biométriques anonymisés.
- Suivi des tentatives pour détecter les fraudes.

En résumé, ce projet permet d'assurer une reconnaissance faciale rapide, simple d'utilisation et sécurisée afin de faciliter la connexion des utilisateurs.
