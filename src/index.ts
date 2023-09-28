import * as dotenv from "dotenv"; // pour le .env
import chalk from "chalk";
dotenv.config(); 


import { Client, Collection } from "discord.js";

import EventsHandlers from "./Utils/Handlers/EventsHandlers";
import CommandsHandlers from "./Utils/Handlers/CommandsHandlers";


import setup from "./Models/Setup";


// Controle des librairies.
const libraries = ["discord.js", "axios", "node-ical", "moment", "moment-timezone"];
async function checkLibraries() {
    for (const library of libraries) {
      try {
        require.resolve(library);
        console.log(chalk.grey(`${library} est installée.`));

      } catch (error) {
        console.log(chalk.red(`Bibliothèque manquante : ${library}`));
        console.log(chalk.red(`types following command >> npm install ${library}`));
        if (error){
            process.exit(0); 
        }
    
    }}}
  
console.clear();
console.clear();
checkLibraries();
//Partie Base de
 
setup();

// Partie DiscordJS
const client = new Client({ intents: 3243773  }) as any; //131071 3243773 3276799
client.commands = new Collection(); //permmettra de stocker l'ensemble des commandes

// process.on(`exit`,code => {console.log(`le processus s'est arreté avec le code ${code} !`)}) 
// process.on(`uncaughtExeption`,(err,origin) => {console.log(`uncaughtExeption ${err}, origin : ${origin} !`)}) // gestion des erreurs
// process.on(`unhandledRejection`,(reason,promise) => {console.log(`unhandledRejection ${reason}\n -----\n${promise} !`)})
// process.on(`warning`,(...args) => {console.log(...args)})


client.login(process.env.BOT_TOKEN); // connexion au bot
//process.env.BOT_TOKEN
const mainDiscordJs = async () => {
    
    await EventsHandlers(client); // initialisation sur gestionnaire d'évènement
    await CommandsHandlers(client); // initialisation sur gestionnaire de commandes
}

const main = async () => {

 

    await mainDiscordJs(); // initialisation de discordJS
    
}
main();

/*
async :

Lorsqu'une fonction est déclarée avec le mot-clé async, cela signifie qu'elle retournera toujours une promesse. 
Une promesse est un objet qui représente la réussite ou l'échec d'une opération asynchrone.

Une fonction async peut contenir des opérations asynchrones (telles que des appels de réseau, des lectures de fichiers, des requêtes de base de données, etc.) 
et vous permet d'utiliser le mot-clé await à l'intérieur de la fonction pour attendre la résolution de ces opérations asynchrones.

await :

Le mot-clé await est utilisé à l'intérieur d'une fonction async pour suspendre l'exécution de la fonction jusqu'à ce que la promesse soit résolue (ou rejetée).
*/