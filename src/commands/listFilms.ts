import { Client, ClientUser, CommandInteraction } from "discord.js";
import sequelize from "../Models/Connection";
import { INTEGER, QueryTypes } from 'sequelize';
import Films from "../Models/DBfilms";
import Users from "../Models/User";
import UsersFilms from "../Models/UserFilm";
interface FilmAttributes {
    idFilm: string;
    titre: string;
    realisateur: string;
    dateSortie: string;
  }
  

async function fetchMoviesForUser(userId: string): Promise<string>  {
    try {
      const listFilm = (await sequelize.query(`
      SELECT Films.*
      FROM Films
      INNER JOIN UsersFilms ON Films.idFilm = UsersFilms.idFilm 
      WHERE UsersFilms.idUser = :userId ;
      `, { //Jointurre interne entre Films et UsersFilms
        replacements: { userId },
        type: QueryTypes.SELECT,
      })) as any[];

      let formattedList = `Liste de films de ${listFilm[0].UserName} :\n`;
      let i=0;
      for (const film of listFilm) {
        console.log(film);
         formattedList += `${i}. Titre : ${film.titre}\n`;
        formattedList += `   Réalisateur : ${film.realisateur}\n`;
        formattedList += `   Date de sortie : ${film.dateSortie}\n\n`;
        i=i+1;
      }

      console.log(formattedList);
      return formattedList;
    } catch (error) {
      const err = `Erreur lors de l'exécution de la requête SQL : ${error}`;
      console.error(err);
      return err;
    }
}
  
module.exports = {
    name: "listfilms", 
    description: "Commande pour ma liste de films", 
    options: [],
  runSlash: async (client: Client, interaction: CommandInteraction) => {
    await  interaction.deferReply({ ephemeral: false });
    const iduser=interaction.user.id;
    //const info =`${interaction.user.username}, cette commande est en cours de programmation`;
    const info=await fetchMoviesForUser(iduser);

    await interaction.editReply({ content: info });
     
    
    }
}


