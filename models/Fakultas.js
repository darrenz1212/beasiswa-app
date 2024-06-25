module.exports = (sequelize, DataTypes) => {
    const Fakultas = sequelize.define('Fakultas', {
        fakultas_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nama_fakultas: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'fakultas',
        timestamps: false
    });

    return Fakultas;
};
