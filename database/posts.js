const { DataTypes } = require("sequelize");
const db = require("./db");
const User = require("./user");

const Post = db.define("post", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // null if trading
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g., textbooks, electronics, calculators, etc.",
  },

  location: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "BMCC Campus",
  },

  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Optional image stored in S3 or public uploads",
  },

  status: {
    type: DataTypes.ENUM("open", "closed"),
    defaultValue: "open",
  },
});

// Relationships
Post.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "emplid",       // relates to User.emplid
  onDelete: "CASCADE",
});

User.hasMany(Post, {
  foreignKey: "userId",
  sourceKey: "emplid",
  onDelete: "CASCADE",
});

module.exports = Post;
