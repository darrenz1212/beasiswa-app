module.exports = (sequelize, DataTypes) => {
    const PengajuanBeasiswa = sequelize.define('PengajuanBeasiswa', {
        pengajuan_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nrp: {
            type: DataTypes.INTEGER,
            allowNull: true // nrp can be null
        },
        beasiswa_id: {
            type: DataTypes.INTEGER,
            allowNull: true // beasiswa_id can be null
        },
        periode_id: {
            type: DataTypes.INTEGER,
            allowNull: true // periode_id can be null
        },
        tanggal_pengajuan: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status_pengajuan: {
            type: DataTypes.ENUM('Diajukan', 'Disetujui Prodi', 'Tidak Disetujui Prodi'),
            allowNull: false
        },
        status_pengajuan_fakultas: {
            type: DataTypes.ENUM('Diajukan', 'Disetujui Fakultas', 'Tidak Disetujui Fakultas'),
            allowNull: false
        },
        dokumen_pengajuan: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
        {
        tableName: 'pengajuan_beasiswa',
        timestamps: false
    });

    return PengajuanBeasiswa;
};