import { DataTypes } from "sequelize";
import Connection from "./Connection";

const Films = Connection.define("Film", {
    idFilm: {
        type: DataTypes.STRING(), 
        allowNull: false, 
        primaryKey: true, 
    },

    titre: {
        type: DataTypes.STRING(30), 
        allowNull: false, 
        unique: true
    }, 

    realisateur: {
        type: DataTypes.STRING(30), 
        allowNull: false, 
    }, 

    dateSortie: {
        type: DataTypes.STRING(20), 
        allowNull: false   
    }, 

   
}, { timestamps: false });

export default Films; 