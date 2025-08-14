'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CollectionResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CollectionResult.init({
    collectionId: DataTypes.INTEGER,
    known: DataTypes.INTEGER,
    unknown: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CollectionResult',
  });
  return CollectionResult;
};