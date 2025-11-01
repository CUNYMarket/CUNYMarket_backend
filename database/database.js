require("dotenv").config();
const { Sequelize } = require("sequelize");
const pg = require("pg");

const dbName = "CUNYMarket";

const db = new Sequelize(
    process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`,
    {
     logging: false, // comment this line to enable SQL logging   
    }
)