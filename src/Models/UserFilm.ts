import { DataTypes } from "sequelize";
import Connection from "./Connection";
import Films from "./DBfilms";
const UsersFilms = Connection.define("UsersFilms", {
    idFilm: {
        type: DataTypes.STRING, 
        allowNull: false, 
    },
    idUser: {
        type: DataTypes.STRING, 
        allowNull: false, 
    
    },
    id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        primaryKey: true, 
        autoIncrement: true
    },
 

   
}, { timestamps: false });


UsersFilms.belongsTo(Films, { foreignKey: 'idFilm' });
export default UsersFilms;

