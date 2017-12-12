const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        userName: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isAlphanumeric: true,
                notEmpty: true,
            },
            unique: true,
        },
        firstName: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            },
        },
        lastName: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                notEmpty: true,
            },
        },
        password_hash:{ //To be implemented soon
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.VIRTUAL,
            validate:{
                notEmpty: true,
            },
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            validate:{
                notEmpty: true,
            },
            unique: true,
        },
    });

    /*
      So we can list all the posts a user has made
    */
    User.associate = (models) => {
        models.User.hasMany(models.Thread);
    }
    

  User.beforeCreate((user) =>
    new sequelize.Promise((resolve) => {
      bcrypt.hash(user.password, null, null, (err, hashedPassword) => {
        resolve(hashedPassword);
      });
    }).then((hashedPw) => {
      user.password_hash = hashedPw;
    })
  );
    return User;
};