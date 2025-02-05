import cron from "node-cron";
import mysql from "mysql2/promise";
import { TextChannel, EmbedBuilder } from "discord.js";

const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

// Fonction pour planifier les rappels
export const scheduleReminder = async (
  client,
  userId,
  eventId,
  date,
  time,
  title,
  description,
  where,
  channelId,
  everyoneTF,
  numberCallback,
  userName
) => {
  // Extraction de l'heure et de la minute depuis le paramètre time
  const [hour, minute] = time.split(":").map(Number);
  
  // Si date est une chaîne, on la convertit en objet Date
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) {
    console.error("Date invalide :", date);
    return;
  }

  const reminders = [];

  // Rappel 2 heures avant l'événement (si numberCallback >= 1)
  if (numberCallback >= 1) {
    const twoHoursBefore = new Date(date.getTime() - 2 * 60 * 60 * 1000);
    reminders.push({
      date: twoHoursBefore,
      message: "🕒 Rappel : Événement dans **2 heures** !",
    });
  }

  // Rappel le matin du jour J à 10h (si numberCallback >= 2)
  if (numberCallback >= 2) {
    const dayOfEvent = new Date(date);
    dayOfEvent.setHours(10, 0, 0);
    reminders.push({
      date: dayOfEvent,
      message: "🌅 Bon matin ! Votre événement a lieu **aujourd'hui**.",
    });
  }

  // Rappel 10 jours avant l'événement (si numberCallback === 3)
  if (numberCallback === 3) {
    const tenDaysBefore = new Date(date);
    tenDaysBefore.setDate(date.getDate() - 10);
    reminders.push({
      date: tenDaysBefore,
      message: "📅 Rappel : Votre événement a lieu **dans 10 jours**.",
    });
  }

  // Planifier chaque rappel avec node-cron
  reminders.forEach(({ date: reminderDate, message: reminderMessage }) => {
    // Construction de l'expression cron à partir de l'objet Date
    const cronExpression = `${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`;
    console.log("📅 Cron planifié :", cronExpression, "pour le rappel:", reminderMessage);

    cron.schedule(cronExpression, async () => {
      try {
        const channel = client.channels.cache.get(channelId);
        if (channel instanceof TextChannel) {
          // Création de l'embed pour le rappel
          const reminderEmbed = new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle(`📢 ${title}`)
            .setDescription(description)
            .addFields(
              { name: "📅 Date", value: date.toISOString().split("T")[0], inline: true },
              { name: "🕒 Heure", value: time, inline: true },
              { name: "📍 Lieu", value: where, inline: true }
            )
            .setFooter({ text: `Rappel programmé par ${userName} <@${userId}>` })
            .setTimestamp();

          // Déterminer la mention à utiliser en fonction de everyoneTF
          const mention = everyoneTF ? "@everyone " : `<@${userId}> `;
          await channel.send({ content: mention + reminderMessage, embeds: [reminderEmbed] });

          await markAsNotified(eventId);
          console.log("✅ Rappel envoyé avec succès :", reminderMessage);
        }
      } catch (err) {
        console.error("❌ Erreur lors de l'envoi du rappel :", err);
      }
    });
  });
};

// Fonction pour marquer un événement comme notifié dans la base de données
const markAsNotified = async (eventId) => {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute(`UPDATE events SET notified = 1 WHERE id = ?`, [eventId]);
  connection.end();
};
