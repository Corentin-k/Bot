import { Client, Collection, CommandInteraction } from "discord.js";
import axios from 'axios';

async function getBookInfo(Titre: string): Promise<string> {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(Titre)}`);  //&key=${process.env.API_GOOGLE} https://developers.google.com/books/docs/v1/using?hl=fr
      const book = response.data.items[0]; // Prenez le premier résultat (vous pouvez gérer les résultats multiples)
      const title = book.volumeInfo.title;
      const year = book.volumeInfo.publishedDate;
      const author = book.volumeInfo.authors?.join(', ') || 'Auteur inconnu';
      const description = book.volumeInfo.description || 'Pas de description disponible';
    console.log(response);
    
      return `**Titre**: ${title}\n**Auteur**: ${author}\n**Description**: ${description}\n**year**: ${year}`;
    } catch (error) {
      return 'Aucune information trouvée pour ce livre.';
    }
  }

// Fonction pour récupérer les informations d'un film en utilisant l'API OMDb
async function getMovieInfo(query: string): Promise<string> {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=YOUR_API_KEY`);
      const movie = response.data;
      const title = movie.Title;
      const year = movie.Year;
      const director = movie.Director;
      const plot = movie.Plot;
  
      return `**Titre**: ${title}\n**Année**: ${year}\n**Réalisateur**: ${director}\n**Synopsis**: ${plot}`;
    } catch (error) {
      return 'Aucune information trouvée pour ce film.';
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
    let message="En cours de programmation !!"
    let livre= interaction.options.getString("title") as string;
    const bookInfo = await getBookInfo(livre);
    console.log(bookInfo);
    await interaction.editReply({ content: message});
    }
}


