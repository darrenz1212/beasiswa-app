module.exports = (sequelize, DataTypes) => {
    const Fakultas = sequelize.define('Fakultas', {
        fakultas_id :{
            type : DataTypes.INTEGER,
            primaryKey : true
        },
        nama_fakultas : DataTypes.STRING
    }, {
        tableName: 'Fakultas',
        timestamps: false
    });

    return Fakultas;
};
