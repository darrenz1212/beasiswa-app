const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('beasiswa', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


const Mahasiswa = require('./Mahasiswa')(sequelize, Sequelize.DataTypes);
const User = require('./User')(sequelize, Sequelize.DataTypes);
const JenisBeasiswa = require('./JenisBeasiswa')(sequelize, Sequelize.DataTypes);
const PeriodePengajuan = require('./PeriodePengajuan')(sequelize, Sequelize.DataTypes);
const DokumenPengajuan = require('./DokumenPengajuan')(sequelize, Sequelize.DataTypes);
const Fakultas = require('./Fakultas')(sequelize, Sequelize.DataTypes);
const ProgramStudi = require('./ProgramStudi')(sequelize, Sequelize.DataTypes);
const PengajuanBeasiswa = require('./PengajuanBeasiswa')(sequelize, Sequelize.DataTypes);


const db = {
    sequelize,
    Sequelize,
    Mahasiswa,
    User,
    JenisBeasiswa,
    PeriodePengajuan,
    DokumenPengajuan,
    Fakultas,
    ProgramStudi,
    PengajuanBeasiswa
};

// Set up associations
db.JenisBeasiswa.belongsTo(db.PeriodePengajuan, { foreignKey: 'periode_id' });
db.DokumenPengajuan.belongsTo(db.PengajuanBeasiswa, { foreignKey: 'pengajuan_id' });
db.Mahasiswa.belongsTo(db.ProgramStudi,{foreignKey:'program_studi_id'});
db.PengajuanBeasiswa.belongsTo(db.Mahasiswa, {foreignKey:"nrp"});
db.PengajuanBeasiswa.belongsTo(db.JenisBeasiswa, {foreignKey:"beasiswa_id"});
db.PengajuanBeasiswa.belongsTo(db.PeriodePengajuan, {foreignKey:"periode_id"});
db.ProgramStudi.belongsTo(db.Fakultas,{foreignKey:'fakultas_id'});


module.exports = db;
