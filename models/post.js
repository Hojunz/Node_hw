'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      models.Post.hasMany(models.Comment, {foreignKey: "post_id", sourceKey: "id",});
      models.Post.belongsTo(models.User, {foreignKey: "user_id", targetKey: "id",});
      models.Post.hasMany(models.Like, { foreignKey: "post_id" });
    }
  }
  Post.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    likes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};