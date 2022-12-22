'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.Comment, {foreignKey: "user_id", sourceKey: "id",});
      models.User.hasMany(models.Post, {foreignKey: "user_id", sourceKey: "id",}); 
    }
  }
  User.init({
    email: DataTypes.STRING,
    nickname: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};