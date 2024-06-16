
module.exports = (sequelize, DataTypes) => {
    const JenisBeasiswa = sequelize.define('JenisBeasiswa', {
        beasiswa_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        periode_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nama_beasiswa: DataTypes.STRING,
        deskripsi_beasiswa: DataTypes.STRING
    }, {
        tableName: 'jenis_beasiswa',
        timestamps: false
    });

    // Define relationship
    JenisBeasiswa.associate = models => {
        JenisBeasiswa.belongsTo(models.PeriodePengajuan, { foreignKey: 'periode_id', targetKey: 'periode_id' });
    };

    return JenisBeasiswa;
};



