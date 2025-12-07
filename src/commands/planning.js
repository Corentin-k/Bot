
import { EmbedBuilder } from "discord.js";

import { get_agenda, transfo_date, date_cours, verifier_date } from "../agenda.js";
import moment from "moment";
import mysql from "mysql2/promise";

// Configuration de la base de données
const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};


export default {
  name: "planning",
  description: "Commande pour obtenir le planning d'une personne",
  options: [
    {
      name: "name",
      description: "Nom de la personne, par défaut le vôtre",
      required: false,
      type: 3,
    },
    {
      name: "date",
      description: "Date sous la forme AAAA-MM-JJ",
      required: false,
      type: 3,
    },
    {
      name: "ephemeral",
      description: "Est-ce que la réponse doit être éphémère ?",
      required: false,
      type: 3,
    },
  ],
  runSlash: async (client, interaction) => {

    const isEphemeral = interaction.options.getString("ephemeral");
    let connection = await mysql.createConnection(dbConfig);
    let statuts;
    statuts = isEphemeral !== "false";
    // Remplace l'usage de ephemeral par flags
    await interaction.deferReply({ flags: statuts ? 64 : 0 });

    console.log(interaction.user);
    let nom;
    if(interaction.options.getString("name")){
       nom = interaction.options.getString("name")?.toLowerCase();
    }
    else{
      const [rows] = await connection.execute(
        "SELECT user_name FROM user_plannings WHERE user_id = ?",
        [interaction.user.id]
      );
      console.log(rows);
      nom = rows[0].user_name;
    }
    console.log(nom);
    const dateInput = interaction.options.getString("date") || "";
    const date = transfo_date(dateInput);

    if (!interaction.channel || interaction.channelId !== process.env.BOT_PLANNING_CHANNEL) {
      return interaction.editReply({
        content: "Vous ne pouvez pas utiliser cette commande dans ce salon !",
        flags:  64
      });
    }

    // Vérification de la date
    if (verifier_date(date) === "false") {
      return interaction.editReply({
        content: `${date} est une date invalide. Format attendu : AAAA-MM-JJ.`,
        flags:  64
      });
    }

    // Connexion à la base de données
  
    try {
     

      // Recherche de l'URL associée au nom
      const [rows] = await connection.execute("SELECT planning_url FROM user_plannings WHERE user_name = ?", [nom]);

      if (rows.length === 0) {
        return interaction.editReply({
          content: `Aucune URL de planning trouvée pour ${nom}. Veuillez vérifier le nom ou ajouter une URL avec /addPlanning.`,
          flags:  64
          
        });
      }
      console.log(rows)
      const url = rows[0].planning_url;
      console.log(url)
      // Chargement de l'agenda depuis l'URL
      const agenda = await get_agenda(url);
      const coursDuJour = date_cours(agenda, date);

      if (coursDuJour.length === 0) {
        return interaction.editReply({
          content: `${nom} n'a pas de cours le ${date} 🎉`,
          flags:  64
  
        });
      }

      // Création de l'embed
      const embed = new EmbedBuilder()
        .setTitle(`Cours de ${nom}`)
        .setDescription(`__Voici vos cours du ${date} :__\n`)
        .setColor(0x00bfff)
        .setFooter([{ text: `Total de ${coursDuJour.length} cours pour le ${date}` },])
        .setThumbnail("https://www.efrei.fr/wp-content/uploads/2022/01/LOGO_EFREI-PRINT_EFREI-WEB.png");

      coursDuJour.forEach(({ nom_cours, salle, start, end }) => {
        embed.addFields([
          { name: nom_cours, value: salle, inline: true },
          { name: "Horaires", value: `${moment(start, "HH:mm").format("HH:mm")} - ${ moment(end, "HH:mm").format("HH:mm")}`, inline: true },
          { name: "\u200B", value: "\u200B", inline: false },]
        );
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Erreur lors de l'accès à la base de données ou au planning :", error);
      return interaction.editReply({
        content: "Une erreur est survenue lors de la récupération du planning. Veuillez réessayer plus tard.",
        flags:  64
      
      });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  },
};
