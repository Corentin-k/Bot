import { Client, ClientUser, CommandInteraction, MessageEmbed } from "discord.js";
import { get_agenda, transfo_date, date_cours, verifier_date } from "../agenda";
import moment from "moment";

module.exports = {
  name: "planning",
  description: "Commande pour obtenir le planning d'une personne",
  options: [
    {
      name: "name",
      description: "Nom de la personne",
      required: true,
      type: "STRING",
    },
    {
      name: "date",
      description: "Date sous la forme AAAA-MM-JJ",
      required: false,
      type: "STRING",
    },
  ],
  runSlash: async (client: Client, interaction: CommandInteraction) => {
    await  interaction.deferReply({ ephemeral: true });
      // Récupère les valeurs des options 'name' et 'date' depuis l'interaction
    let NOM = interaction.options.getString("name") as string;
    let DATE = interaction.options.getString("date") ?? "";
    
    NOM=NOM.toLowerCase();
   
    // Vérifie si l'interaction se déroule dans un canal spécifique
    if (!interaction.channel || interaction.channelId !== process.env.BOT_PLANNING_CHANNEL) {
        return interaction.editReply({
          content: "Vous ne pouvez pas utiliser cette commande dans ce salon !",
          
        });
      }
    console.log(NOM);

   
    if (NOM!== "corentin") {
      if (NOM !== "maxime" ) {
        if (NOM !== "kevin") {
          return interaction.editReply({
            content: "Vous devez entrer le nom d'une personne !",
        
       });
      }
     }
    }
    //Recupere l'url associé au nom
    let url;
    if (NOM === "maxime") {
      url = process.env.MAXIME;
    } else if (NOM === "corentin") {
      url = process.env.CORENTIN;
    } else if (NOM === "kevin") {
      url = process.env.KEVIN;
    } else {
      const message = "Syntaxe invalide. Le prénom est incorrecte";
      return  interaction.editReply({ content: message});
    }

    console.log(url);
    if (!url) {
        const message = "URL non définie";
        return interaction.editReply({ 
          content: message, 
         
        });
      }

    //Recupère l'agenda
    const cal= await get_agenda(url);

    //Modifie la date 
    DATE = transfo_date(DATE); // si la date est de type vide, today, tomorrow ou JJ et la transforme en AAAA-MM-JJ
    
    // Sinon on vérifie que la date donnée est bien dans le format AAAA-MM-JJ.
    let verif_date = verifier_date(DATE);

    if (verif_date === "false"){
      const message = `Veuillez insérer une date valide : ${DATE} n'est pas une date valide. Format : AAAA-MM-JJ`
      console.log(`date invalide entrée ${DATE}`)

      return interaction.editReply({
        content: message,
      });}

   console.log(DATE);
    const liste_cours = date_cours(cal, DATE);
    
    
    // Mise en forme de l'affichage
   
    if (liste_cours.length === 0) {
      const message = `${NOM} n'a pas de cours le ${DATE} 🎉`;
      console.log(message);
     
      return interaction.editReply({
        content: message,

      });
  
    }
    
    const affichage = new MessageEmbed();
    affichage.setTitle(`Cours de ${NOM}`);
    affichage.setDescription(`__Voici vos cours du ${DATE} :__\n`);
    affichage.setColor(0x00BFFF);

    for (const cours of liste_cours) {
      const { nom_cours, salle, start, end } = cours;
      const debut = moment(start, "HH:mm").format("HH:mm");
      const fin = moment(end, "HH:mm").format("HH:mm");

      affichage.addFields(
        { name: nom_cours, value: salle, inline: true },
        { name: "Horaires", value: `${debut} / ${fin}`, inline: true },
        { name: "\u200B", value: "\u200B", inline: false }
      );
    }
    
    affichage.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL() ?? undefined,
    });

    affichage.setThumbnail(
      "https://www.efrei.fr/wp-content/uploads/2022/01/LOGO_EFREI-PRINT_EFREI-WEB.png"
    );
    console.log(liste_cours.length);
    affichage.setFooter({ text: `Vous avez un total de ${liste_cours.length} cours le ${DATE}` });

    await interaction.editReply({ embeds: [affichage]});
    },
}
