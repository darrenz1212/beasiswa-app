const {STRING} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const DokumenPengajuan = sequelize.define('DokumenPengajuan', {
        dokumen_id : {
            type : DataTypes.INTEGER,
            primaryKey : true
        },
        pengajuan_id : DataTypes.INTEGER,
        nama_dokumen : DataTypes.STRING,
        path_dokumen : DataTypes.STRING
    }, {
        tableName: 'dokumen_pengajuan',
        timestamps: false
    });

    return DokumenPengajuan;
};
