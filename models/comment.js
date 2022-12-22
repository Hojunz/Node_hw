'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      models.Comment.belongsTo(models.User, {foreignKey: "user_id", targetKey: "id",});
      models.Comment.belongsTo(models.Post, {foreignKey: "post_id", targetKey: "id",});
    }
  }
  Comment.init({
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};