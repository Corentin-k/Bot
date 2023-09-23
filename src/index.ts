import * as dotenv from "dotenv"; // pour le .env
dotenv.config();


import { Client, Collection } from "discord.js";

import EventsHandlers from "./Utils/Handlers/EventsHandlers";
import CommandsHandlers from "./Utils/Handlers/CommandsHandlers";

// Partie DiscordJS
const client = new Client({ intents: 3243773  }) as any; //131071 3243773 3276799
client.commands = new Collection(); //permmettra de stocker l'ensemble des commandes

process.on(`exit`,code => {console.log(`le processus s'est arreté avec le code ${code} !`)}) 
process.on(`uncaughtExeption`,(err,origin) => {console.log(`uncaughtExeption ${err}, origin : ${origin} !`)}) // gestion des erreurs
process.on(`unhandledRejection`,(reason,promise) => {console.log(`unhandledRejection ${reason}\n -----\n${promise} !`)})
process.on(`warning`,(...args) => {console.log(...args)})


client.login(process.env.BOT_TOKEN); // connexion au bot
//process.env.BOT_TOKEN
const mainDiscordJs = async () => {
    console.clear();
    console.clear();
    await EventsHandlers(client); // initialisation sur gestionnaire d'évènement
    await CommandsHandlers(client); // initialisation sur gestionnaire de commandes
}

const main = async () => {
    await mainDiscordJs(); // initialisation de discordJS
    
}
main();