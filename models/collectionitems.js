'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CollectionItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CollectionItems.init({
    slug: DataTypes.STRING,
    collectionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CollectionItems',
  });
  return CollectionItems;
};