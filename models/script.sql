DROP database if exists double_verification;
CREATE DATABASE double_verification;
USE double_verification;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passwords (
    password_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE face_recognition_data (
    face_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    face_descriptors JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- Exemple de sélection des données
SELECT * FROM face_recognition_data;
SELECT * FROM users;
