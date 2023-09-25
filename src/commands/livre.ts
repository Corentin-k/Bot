import { Client, Collection, CommandInteraction } from "discord.js";
import axios from 'axios';
interface infoLivre {
  title: string;
  year: string;
  author: string;
  description: string;
}
async function getBookInfo(Titre: string): Promise<infoLivre | string> {
  
    try {
      if(!process.env.APi_GOOGLE){
        return "Clef de l'API manquante";
      }

      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(Titre)}&key=${process.env.API_GOOGLE}`);  //&key=${process.env.API_GOOGLE} https://developers.google.com/books/docs/v1/using?hl=fr
      
      //appercu du réponse :https://www.googleapis.com/books/v1/volumes?q=Fondation
      const book = response.data.items[0]; // Prenez le premier résultat (vous pouvez gérer les résultats multiples)

      const infoLivre: infoLivre = {

        title:book.volumeInfo.title,
        year: book.volumeInfo.publishedDate,
        author: book.volumeInfo.authors?.join(', ') || 'Auteur inconnu',
        description: book.volumeInfo.description || 'Pas de description disponible',

      };
    
      return infoLivre;
      
      
   
    } catch (error) {
      return 'Aucune information trouvée pour ce livre. ou Clef API incorrect';
    }
  }


module.exports = {
    name: "livre",
    description: "Commande pour obtenir l'info d'un livre",
    options: [
      {
        name: "title",
        description: "Titre du livre",
        required: true,
        type: "STRING",
      },
      {
        name: "author",
        description: "Auteur du livre",
        required: false,
        type: "STRING",
      },
    ],
  runSlash: async (client: Client, interaction: CommandInteraction) => {
    await  interaction.deferReply({ ephemeral: true });
    
    const livre = interaction.options.getString("title") as string;
    const infoLivre = await getBookInfo(livre);

    if (typeof infoLivre === 'string') {
      await interaction.editReply({ content: infoLivre });
    } else {
      const info = `**Titre**: ${infoLivre.title}\n**Auteur**: ${infoLivre.author}\n**Description**: ${infoLivre.description}\n**Année de publication**: ${infoLivre.year}`;
      await interaction.editReply({ content: info });
    }
  

    
    console.log(infoLivre);
    
    }
}


