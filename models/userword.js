'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserWord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserWord.init({
    userId: DataTypes.INTEGER,
    slug: DataTypes.STRING,
    last_seen: DataTypes.DATE,
    times_known: DataTypes.INTEGER,
    times_unknown: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserWord',
  });
  return UserWord;
};