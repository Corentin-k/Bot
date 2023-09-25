import { Client, ClientUser, CommandInteraction } from "discord.js";
import axios from 'axios';
///https://www.omdbapi.com/

interface infoFilm {
  title: string;
  year: string;
  director: string;
  plot: string;

 
  
}

// Fonction pour récupérer les informations d'un film en utilisant l'API OMDb
async function getMovieInfo(query: string): Promise<infoFilm | string> {
   
    try {
      if(!process.env.API_FILM){
       
        return "Clef de l'API manquante";
      }
      const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${process.env.API_FILM}`);
      const movie = response.data;
      const infoFilm: infoFilm = {

        title:movie.Title,
        year: movie.Year,
        director: movie.Director || 'Réalisateur inconnu',
        plot: movie.Plot || 'Pas de description disponible',
       
      };
    




      return infoFilm;
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
    const filmInfo = await getMovieInfo(film);
    console.log(filmInfo);

    console.log(interaction.user.username);

    console.log(interaction.user.avatarURL());
    if (typeof filmInfo === 'string') {
      await interaction.editReply({ content: filmInfo });
    } else {
      const info = `**Titre**: ${filmInfo.title}\n**Réalisateur**: ${filmInfo.director}\n**Synopsis**: ${filmInfo.plot}\n**Année**: ${filmInfo.year}`;
      await interaction.editReply({ content: info });
    }

    }
}


