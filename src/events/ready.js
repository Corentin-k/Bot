import { Events, ActivityType } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log("Bot launched !");

        // Enregistrement des commandes sur le serveur de dev
        const devGuild = client.guilds.cache.get(process.env.SERV_ID);
        if (devGuild) {
            await devGuild.commands.set(client.commands.map((cmd) => cmd));
            console.log(`Commandes enregistrées sur : ${devGuild.name}`);
        } else {
            console.warn("Serveur de dev introuvable (Vérifie SERV_ID dans .env)");
        }

        client.user.setActivity({
            name: process.env.UTILISATEUR ,
            type: ActivityType.Playing
        });
    }
};