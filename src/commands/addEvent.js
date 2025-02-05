import mysql from "mysql2/promise";
import { scheduleReminder } from "../scheduler.js";
import { transfo_date, verifier_date } from "../agenda.js";

const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

export default {
  name: "addevent",
  description: "Ajoutez un événement",
  options: [
    {
      name: "title",
      description: "Titre de l'événement",
      type: 3,
      required: true,
    },
    {
      name: "description",
      description: "Description de l'événement",
      type: 3,
      required: true,
    },
    {
      name: "date",
      description: "Date de l'événement - AAAA-MM-JJ",
      type: 3,
      required: true,
    },
    {
      name: "houre",
      description: "Heure de l'événement - HH:MM",
      type: 3,
      required: true,
    },
    {
      name: "where",
      description: "Lieu de l'événement",
      type: 3,
      required: true,
    },
    {
      name: "everyonetf",
      description: "Faut-il ping @everyone ? (true/false)",
      type: 3,
      required: true,
    },
    {
      name: "numbercallback",
      description:
        "Nombre de rappels : 1 = 2h avant, 2 = 10h le jour J + 2h avant, 3 = 10 jours avant",
      type: 4, // nombre entier
      required: true,
    },
  ],

  runSlash: async (client, interaction) => {
    await interaction.deferReply();

    const userId = interaction.user.id;
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const dateInput = interaction.options.getString("date");
    const timeInput = interaction.options.getString("houre");
    const where = interaction.options.getString("where");
    const everyoneTF = interaction.options.getString("everyonetf") === "true";
    const numberCallback = interaction.options.getInteger("numbercallback");
    const channelId = interaction.channelId;

    try {
      const connection = await mysql.createConnection(dbConfig);
      const date = transfo_date(dateInput);
      if (!verifier_date(date)) {
        return interaction.editReply({
          content: `${dateInput} est une date invalide. Format attendu : AAAA-MM-JJ.`,
        });
      }

      // Insertion de l'événement dans la base de données
      const [result] = await connection.execute(
        `INSERT INTO events (user_id, title, description, dateEvent, heureEvent, location, everyoneTF, numberCallback) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, title, description, date, timeInput, where, everyoneTF, numberCallback]
      );

      const eventId = result.insertId;

      // Appel de la fonction de planification des rappels, en passant globalName
      await scheduleReminder(
        client,
        userId,
        eventId,
        date,
        timeInput,
        title,
        description,
        where,
        channelId,
        everyoneTF,
        numberCallback,
        interaction.user.globalName 
      );

      await interaction.editReply({
        content: `📅 Événement ajouté : **"${title}"**\n📍 *${where}* le **${dateInput}** à **${timeInput}**.\n🔔 Rappel(s) programmé(s).`,
      });

      connection.end();
    } catch (err) {
      console.error(err);
      return interaction.editReply({
        content: "❌ Une erreur est survenue lors de l'ajout de l'événement.",
      });
    }
  },
};
