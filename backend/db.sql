CREATE DATABASE IF NOT EXISTS owlbot;
USE owlbot;

-- Table pour stocker les plannings utilisateurs
CREATE TABLE IF NOT EXISTS user_plannings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    planning_url TEXT NOT NULL,
    user_name TEXT NOT NULL
) ENGINE=InnoDB;

-- Table pour stocker les événements planifiés
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    dateEvent DATE NOT NULL,
    heureEvent TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    everyoneTF BOOLEAN NOT NULL,
    numberCallback INT NOT NULL,
    notified BOOLEAN DEFAULT 0,
    UNIQUE (user_id, title, dateEvent, heureEvent)
) ENGINE=InnoDB;
