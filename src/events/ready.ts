const {Client, Intents} = require("discord.js")

module.exports = {
    name: "ready", 
    once: true, 
    async execute (client: any) {
        console.log("Bot launched !");
        
        const devGuild = client.guilds.cache.get(process.env.SERV_ID as string);
        devGuild?.commands.set(client.commands.map((cmd: any) => cmd))

        client.user.setActivity({
            name: process.env.UTILISATEUR
        })
    }
}