import { Client } from "discord.js";

//(système de fichiers)
import { readdirSync } from "fs";

// Importe la bibliothèque 'chalk' pour la coloration du texte dans la console
import chalk from "chalk";

export default async (client: Client) => {   

    // Chemin complet vers le répertoire contenant les fichiers d'événements
    const allEventsPath = process.cwd() + "/src/events";

    // Liste tous les noms de fichiers dans le répertoire des événements
    const allEventsFileName = readdirSync(allEventsPath);
    
     // Parcourt chaque nom de fichier d'événement
    allEventsFileName.map((eventFile: string) => {

        // Importe l'événement depuis son fichier
        const event = require(allEventsPath + "/" + eventFile);
         // Vérifie si l'événement est dans la liste des événements autorisés et s'il a un nom
        
         if (!eventList.includes(event.name)|| !event.name){
            return console.log(`-----\Evenement non-déclenché \nFichier -> ${eventFile}\n-----`)
        }

        console.log(chalk.green("Événement chargé : " + event.name));
        
        if(event.once) {
            
            client.once(event.name, (...args: any) => event.execute(client, ...args)); // si once=True on lance le programme qui est dans .execute
        }else client.on(event.name, (...args: any) => event.execute(client, ...args));
    })
}
 



const eventList = ['apiRequest', 'apiResponse', 'applicationCommandCreate', 'applicationCommandDelete', 'applicationCommandUpdate', 'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'debug', 'emojiCreate', 'emojiDelete', 'emojiUpdate', 'error', 'guildBanAdd', 'guildBanRemove', 'guildCreate', 'guildDelete', 'guildIntegrationsUpdate', 'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMembersChunk', 'guildMemberUpdate', 'guildScheduledEventCreate', 'guildScheduledEventDelete', 'guildScheduledEventUpdate', 'guildScheduledEventUserAdd', 'guildScheduledEventUserRemove', 'guildUnavailable', 'guildUpdate', 'interaction', 'interactionCreate', 'invalidated', 'invalidRequestWarning', 'inviteCreate', 'inviteDelete', 'message', 'messageCreate', 'messageDelete', 'messageDeleteBulk', 'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji', 'messageUpdate', 'presenceUpdate', 'rateLimit', 'ready', 'roleCreate', 'roleDelete', 'roleUpdate', 'shardDisconnect', 'shardError', 'shardReady', 'shardReconnecting', 'shardResume', 'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate', 'stickerCreate', 'stickerDelete', 'stickerUpdate', 'threadCreate', 'threadDelete', 'threadListSync', 'threadMembersUpdate', 'threadMemberUpdate', 'threadUpdate', 'typingStart', 'userUpdate', 'voiceStateUpdate', 'warn', 'webhookUpdate'];