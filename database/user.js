const { DataTypes } = require("sequelize");
const db = require("./db");
const bcrypt = require('bcrypt');

const User = db.define("user", {
    emplid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true, 
        validate: {
            isEmail: true,
        }
    }, 

    password_hash: {
        type: DataTypes.STRING, 
        allowNull: false,
        comment: "Securely hashed password",
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    phone_number: {
        type: DataTypes.STRING, 
        allowNull: false,
    }, 
}, {
    tableName: 'users',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated',
});

// Check password
User.prototype.checkPassword = function (password) {
    if(!this.password_hash) {
        return false; 
    }
    return bcrypt.compareSync(password, this.password_hash);
};

// Hash password 
User.hashPassword = function (password) {
    return bcrypt.hashSync(password, 10);
}

module.exports = User;


