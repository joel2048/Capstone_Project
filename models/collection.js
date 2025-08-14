'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Collection.init({
    collectionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    collectionName: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    cardTotal: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Collection',
  });
  return Collection;
};