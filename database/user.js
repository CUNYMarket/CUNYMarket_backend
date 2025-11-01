const { Datatypes } = require("sequelize");
const db = require("./database");
const bcrypt = require('bcrypt');

const User = db.define("user", {
    emplid: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    email: {
        type: Datatypes.STRING,
        allowNull: false, 
        unique: true, 
        validate: {
            isEmail: true,
        }
    }, 

    password_hash: {
        type: Datatypes.STRING, 
        allowNull: true,
        comment: "Securely hashed password",
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


