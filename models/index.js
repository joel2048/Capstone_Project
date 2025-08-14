'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

//models
db.Word = require("./word")(sequelize, Sequelize.DataTypes);
db.CollectionItems = require("./collectionitems")(sequelize, Sequelize.DataTypes);
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Collection = require("./collection")(sequelize, Sequelize.DataTypes);
db.UserWord = require("./userword")(sequelize, Sequelize.DataTypes);

//associations
db.CollectionItems.belongsTo(db.Word, { foreignKey: 'slug' })
db.CollectionItems.belongsTo(db.Collection, { foreignKey: 'collectionId' })
db.Word.hasMany(db.CollectionItems, { foreignKey: 'slug' })
db.Collection.hasMany(db.CollectionItems, { foreignKey: 'collectionId' })

db.UserWord.belongsTo(db.User, { foreignKey: 'userId' })
db.UserWord.belongsTo(db.Word, { foreignKey: 'slug' })
db.User.hasMany(db.UserWord, { foreignKey: 'userId' })
db.Word.hasMany(db.UserWord, { foreignKey: 'slug' })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
