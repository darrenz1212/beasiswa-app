const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('beasiswa', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Mengimpor model
const Mahasiswa = require('./mahasiswa')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);

module.exports = { sequelize, Mahasiswa, User };
