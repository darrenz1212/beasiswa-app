module.exports = (sequelize, DataTypes) => {
    const ProgramStudi = sequelize.define('ProgramStudi', {
        program_studi_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nama_program_studi: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fakultas_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'program_studi',
        timestamps: false
    });

    ProgramStudi.associate = models => {
        ProgramStudi.belongsTo(models.Fakultas, { foreignKey: 'fakultas_id' });
    };

    return ProgramStudi;
};
