import { Client, ClientUser, CommandInteraction } from "discord.js";
import sequelize from "../Models/Connection";
import { QueryTypes } from 'sequelize';
import Films from "../Models/DBfilms";
import Users from "../Models/User";
import UsersFilms from "../Models/UserFilm";


async function fetchMoviesForUser(userId: string): Promise<string>  {
    try {
      const moviesForUser = await sequelize.query(`
            select * from films f,users u where u.iduser= :userId
      `, {
        replacements: { userId },
        type: QueryTypes.SELECT,
      });
      const list = `Liste de films pour l'utilisateur avec l'ID ${userId} : ${JSON.stringify(moviesForUser)}`;
      console.log(list);
      return list;
    } catch (error) {
        const err = `Erreur lors de l\'exécution de la requête SQL :, ${error}`;
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


