import { DataTypes } from "sequelize";
import Connection from "./Connection";

const Livres = Connection.define("Livre", {
    idLivres: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        primaryKey: true, 
        autoIncrement: true
    },

    titre: {
        type: DataTypes.STRING(100), 
        allowNull: false, 
    },
    sousTitre: {
        type: DataTypes.STRING(100), 
        allowNull: false, 
    },
   
    dateLecture: {
        type: DataTypes.STRING(20), 
        allowNull: false   
    }, 

 
}, { timestamps: false });

export default Livres;