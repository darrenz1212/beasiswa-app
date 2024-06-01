module.exports = (sequelize, DataTypes) => {
    const Mahasiswa = sequelize.define('Mahasiswa', {
        nrp: { type: DataTypes.STRING, primaryKey: true },
        user_id: DataTypes.STRING,
        nama_mahasiswa: DataTypes.STRING,
        program_studi_id: DataTypes.STRING,
        ipk_terakhir: DataTypes.FLOAT,
        status_aktif: DataTypes.BOOLEAN
    }, {
        tableName: 'Mahasiswa',
        timestamps: false
    });

    return Mahasiswa;
};
