require("dotenv").config();
const { Sequelize } = require("sequelize");
const pg = require("pg");

const dbName = "CUNYMarket";

const db = new Sequelize(
    process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`,
    {
     dialect: "postgres",
     protocol: "postgres",
     dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, //needed for Neon SSL
        }, 
     },  
     logging: false,
})

db.authenticate()
    .then(() => console.log("Connected to Neon PostgreSQL"))
    .catch((err) => console.error("❌ Database connection error:", err));
    
module.exports = db;
