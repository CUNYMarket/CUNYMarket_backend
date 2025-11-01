const { DataTypes } = require("sequelize");
const db = require("./db");

const Chat = db.define("chat", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true, // null for private chats
    },

    is_group: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "True if this is a group chat",
    },

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "EMPLID of the user who created the chat",
    },

    users: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // array of user EMPLIDs
        allowNull: false,
        comment: "List of users (emplid) in this chat",
    },
}, {
    tableName: "chats",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated",
});

module.exports = Chat;
