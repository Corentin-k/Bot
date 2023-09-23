import { Client, Collection, CommandInteraction } from "discord.js";
import axios from 'axios';
////https://www.omdbapi.com/

// Fonction pour récupérer les informations d'un film en utilisant l'API OMDb
async function getMovieInfo(query: string): Promise<string> {
   
    try {
      if(!process.env.API_FILM){
       
        return "Clef de l'API manquante";
      }
      const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${process.env.API_FILM}`);
      const movie = response.data;
      const title = movie.Title;
      const year = movie.Year;
      const director = movie.Director;
      const plot = movie.Plot;
      
      return `**Titre**: ${title}\n**Année**: ${year}\n**Réalisateur**: ${director}\n**Synopsis**: ${plot}`;
    } catch (error) {
      
      return 'Aucune information trouvée pour ce film. ou Clef API incorrect';
    }
  }



module.exports = {
    name: "film",
    description: "Commande pour obtenir l'info d'un film",
    options: [
      {
        name: "title",
        description: "Titre du film",
        required: true,
        type: "STRING",
      },
      {
        name: "réalisateur",
        description: "réalisateur du film",
        required: false,
        type: "STRING",
      },
    ],
  runSlash: async (client: Client, interaction: CommandInteraction) => {
    await  interaction.deferReply({ ephemeral: true });
    
    let film= interaction.options.getString("title") as string;
    const bookInfo = await getMovieInfo(film);
    console.log(bookInfo);
    await interaction.editReply({ content: bookInfo});
    }
}


