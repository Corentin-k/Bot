import { MessageEmbed } from "discord.js";

const projectEmbed: (info: any) => MessageEmbed = (info: any): MessageEmbed => {
   
    const embed = new MessageEmbed();
    
    embed.setTitle(info.projectTitle);
    embed.setColor("DARK_BLUE");
    embed.setDescription((info.description as string).slice(0, 4095));
    embed.setFields(
        
    );
    
    return embed;
}

export default projectEmbed;