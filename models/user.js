module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: { type: DataTypes.STRING, primaryKey: true },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING,
        program_studi_id: DataTypes.STRING,
        fakultas_id: DataTypes.STRING
    }, {
        tableName: 'User',
        timestamps: false
    });

    return User;
};
