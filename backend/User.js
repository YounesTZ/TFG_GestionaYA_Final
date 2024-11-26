const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: false,
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    documentacion: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: true,
    },
    hash_clave: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'usuario',
    timestamps: false,
});

module.exports = { sequelize, User };
