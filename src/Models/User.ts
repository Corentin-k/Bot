import { DataTypes } from "sequelize";
import Connection from "./Connection";

const Users = Connection.define("Users", {
    idUser: {
        type: DataTypes.STRING(), 
        allowNull: false, 
       
    },

    UserName: {
        type: DataTypes.STRING(), 
        allowNull: false, 
        unique: true
    },  
    id: {
        type: DataTypes.INTEGER, 
        allowNull: true, 
        primaryKey: true, 
        autoIncrement: true
    }
   
}, { timestamps: false });

export default Users;