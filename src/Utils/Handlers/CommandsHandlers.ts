
// Importe la fonction 'readdirSync' ' (système de fichiers)
import { readdirSync } from "fs";


// Importe la bibliothèque 'chalk' pour la coloration du texte dans la console
import chalk from "chalk";

export default async (client: any) => {   

    // Chemin complet vers le répertoire contenant les fichiers de commandes
    const allCommandsPath = process.cwd() + "/src/commands";

    // Liste tous les noms de fichiers dans le répertoire des commandes
    const allCommandsFileName = readdirSync(allCommandsPath);
    

    // Parcourt chaque nom de fichier de commande
    allCommandsFileName.map((commandFile: string) => {
        
        // Importe la commande depuis son fichier
        const command = require(allCommandsPath + "/" + commandFile);
        
        // Vérifie si la commande a un nom et une description
        if(!command.name || !command.description) {
            return console.log(chalk.red("------\nCommande pas chargée : Pas de description ou de nom\n------"))
        }

        // Ajoute la commande au client Discord
        client.commands.set(command.name, command);

        // Affiche un message indiquant que la commande a été chargée avec succès
        console.log(chalk.blue("Commande chargée :", command.name));
    });
}