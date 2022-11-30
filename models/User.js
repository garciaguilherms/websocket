const Sequelize = require('sequelize');
const db = require('./db');

// Tabela de usuários
const User = db.define('user',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    room: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Se a tabela não existir, ela será criada
// User.sync();

module.exports = User;