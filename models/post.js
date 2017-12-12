module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('post', {
    body: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: true,
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Post.associate = (models) => {
    models.Post.belongsTo(models.Thread);
    models.Post.belongsTo(models.User);
  }
  return Post;
};
