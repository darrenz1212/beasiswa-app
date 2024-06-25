module.exports = (sequelize, DataTypes) => {
    const PeriodePengajuan = sequelize.define('PeriodePengajuan', {
            periode_id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            nama_periode: DataTypes.STRING,
            tanggal_mulai : DataTypes.DATE,
            tanggal_selesai : DataTypes.DATE,
            status : DataTypes.BOOLEAN
        },
        {
            tableName: 'periode_pengajuan',
            timestamps: false
        });

    PeriodePengajuan.associate = models => {
        PeriodePengajuan.hasMany(models.JenisBeasiswa, { foreignKey: 'periode_id' });
    };

    return PeriodePengajuan;
};