module.exports = (sequelize, DataTypes) => {
    const ProgramStudi = sequelize.define('ProgramStudi', {
        program_studi_id : {
            type : DataTypes.STRING,
            primaryKey : true
        },
        nama_program_studi : DataTypes.STRING,
        fakultas_id : DataTypes.INTEGER
    }, {
        tableName: 'program_studi',
        timestamps: false
    });

    return ProgramStudi;
};
