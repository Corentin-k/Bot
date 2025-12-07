import cron from "node-cron";
import mysql from "mysql2/promise";
import { TextChannel, EmbedBuilder } from "discord.js";

const dbConfig = {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
};

// Fonction utilitaire pour envoyer le message (évite de dupliquer le code)
// Fonction utilitaire pour envoyer le message
const sendReminderMessage = async (client, channelId, userId, title, description, date, time, where, userName, everyoneTF, reminderMessage, eventId) => {
    try {
        const channel = client.channels.cache.get(channelId);
        if (channel instanceof TextChannel) {

            // --- CORRECTION ICI ---
            // On s'assure d'avoir une chaîne de caractères propre pour l'affichage
            let dateDisplay = date;
            // Si c'est un objet Date (le format complexe), on le transforme en texte
            if (date instanceof Date) {
                dateDisplay = date.toISOString().split("T")[0];
            }
            // Si c'est déjà du texte (ex: "2025-12-07"), on le garde tel quel
            // ----------------------

            // Création de l'embed
            const reminderEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`📢 ${title}`)
                .setDescription(description)
                .addFields([
                    // On utilise dateDisplay ici au lieu de date.toISOString()
                    { name: "📅 Date", value: dateDisplay, inline: true },
                    { name: "🕒 Heure", value: time, inline: true },
                    { name: "📍 Lieu", value: where, inline: true },]
                )
                .setFooter({ text: `Planifié par ${userName}` })
                .setTimestamp();

            const mention = everyoneTF ? "@everyone " : `<@${userId}> `;

            await channel.send({ content: `${mention} ${reminderMessage}`, embeds: [reminderEmbed] });

            if (reminderMessage.includes("commence") || reminderMessage.includes("Start")) {
                await markAsNotified(eventId);
            }

            console.log("✅ Message envoyé avec succès !");
        }
    } catch (err) {
        console.error("❌ Erreur lors de l'envoi du message :", err);
    }
};

export const scheduleReminder = async (
    client,
    userId,
    eventId,
    date, // Supposé être YYYY-MM-DD (ex: "2023-12-07")
    time, // Supposé être HH:MM (ex: "16:30")
    title,
    description,
    where,
    channelId,
    everyoneTF,
    numberCallback,
    userName
) => {
    // 1. CONSTRUCTION ROBUSTE DE LA DATE
    let eventDate;

    // On s'assure que 'date' est bien une chaine propre YYYY-MM-DD
    let dateString = date;
    if (date instanceof Date) {
        dateString = date.toISOString().split('T')[0];
    }

    // On combine Date + Heure pour créer un timestamp précis
    // Format reconnu universellement : "YYYY-MM-DDTHH:mm:00"
    const finalDateTimeString = `${dateString}T${time}:00`;
    eventDate = new Date(finalDateTimeString);

    // DEBUG : Affiche ce que le bot a compris
    const now = new Date();
    console.log("------------------------------------------------");
    console.log(`🕒 Heure serveur (Now) : ${now.toLocaleString()}`);
    console.log(`📅 Heure événement reçue : ${finalDateTimeString}`);
    console.log(`🤖 Heure événement comprise : ${eventDate.toLocaleString()}`);

    if (isNaN(eventDate.getTime())) {
        console.error("❌ ERREUR DE DATE : Format invalide ->", finalDateTimeString);
        return;
    }

    // Vérification basique anti-retour vers le futur
    // Si l'événement est compris comme étant "hier", on le log
    if (eventDate < now) {
        console.warn("⚠️ ATTENTION : La date calculée est dans le passé !");
        console.warn(`   Différence : ${(now - eventDate)/1000/60} minutes de retard`);
    }
    console.log("------------------------------------------------");

    const reminders = [];

    // --- 1. AJOUT OBLIGATOIRE : LE DÉMARRAGE ---
    reminders.push({
        date: new Date(eventDate),
        message: "🚀 **C'est parti !** L'événement commence **MAINTENANT** !",
        type: "start"
    });

    // --- 2. GESTION DES RAPPELS PRÉCÉDENTS ---
    // On utilise eventDate qui est maintenant fiable
    if (numberCallback >= 1) {
        const twoHoursBefore = new Date(eventDate.getTime() - 2 * 60 * 60 * 1000);
        reminders.push({
            date: twoHoursBefore,
            message: "🕒 Rappel : Événement dans **2 heures** !",
            type: "reminder"
        });
    }

    if (numberCallback >= 2) {
        const dayOfEvent = new Date(eventDate);
        dayOfEvent.setHours(10, 0, 0); // Force 10h00
        // Attention : si l'événement est avant 10h, ce rappel sera dans le futur par rapport à l'événement mais passé par rapport à Now
        // Pour simplifier, on l'ajoute, le trieur en bas s'en occupera
        reminders.push({
            date: dayOfEvent,
            message: "🌅 Votre événement a lieu **aujourd'hui**.",
            type: "reminder"
        });
    }

    if (numberCallback === 3) {
        const tenDaysBefore = new Date(eventDate);
        tenDaysBefore.setDate(eventDate.getDate() - 10);
        reminders.push({
            date: tenDaysBefore,
            message: "📅 Rappel : Votre événement a lieu **dans 10 jours**.",
            type: "reminder"
        });
    }

    // --- 3. PLANIFICATION ---
    reminders.forEach(({ date: reminderDate, message: reminderMessage, type }) => {

        // Logique corrigée pour l'envoi immédiat
        const timeDiff = reminderDate.getTime() - now.getTime();

        // Cas 1 : Le rappel est dans le passé ou très proche (moins de 30 sec)
        if (timeDiff <= 30000) {

            // On n'envoie PAS les vieux rappels (genre le rappel de -10 jours ou -2h s'il est trop tard)
            // SAUF si c'est le "START" (on veut savoir que ça commence même si on a 1 min de retard)
            const isStart = (type === "start");

            // Est-ce que le rappel est "périmé" ? (Plus vieux que 1 heure)
            const isTooOld = timeDiff < -3600000; // -3600000ms = -1 heure

            if (isStart || !isTooOld) {
                console.log(`⚡ Envoi immédiat pour : ${reminderMessage}`);
                sendReminderMessage(client, channelId, userId, title, description, dateString, time, where, userName, everyoneTF, reminderMessage, eventId);
            } else {
                console.log(`🗑️ Rappel ignoré car trop vieux (${Math.round(timeDiff/60000)} min) : ${reminderMessage}`);
            }

        } else {
            // Cas 2 : C'est dans le futur -> CRON
            const cronExpression = `${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`;
            console.log(`📅 Cron planifié pour ${reminderDate.toLocaleString()} : ${reminderMessage}`);

            cron.schedule(cronExpression, async () => {
                await sendReminderMessage(client, channelId, userId, title, description, dateString, time, where, userName, everyoneTF, reminderMessage, eventId);
            });
        }
    });
};

const markAsNotified = async (eventId) => {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(`UPDATE events SET notified = 1 WHERE id = ?`, [eventId]);
    connection.end();
};