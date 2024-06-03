const { User } = require('../models');
const bcrypt = require('bcrypt');


const index = async (req,res) =>{
    res.render('admin/index',{message: "Admin Site"})
}
const getUser = async (req, res) => {
    const userList = await User.findAll();
    const result = userList.map(u => ({
        user_id: u.user_id,
        username: u.username,
        password: u.password,
        role: u.role,
        program_studi_id: u.program_studi_id,
        fakultas_id: u.fakultas_id
    }));
    res.render('admin/showuser',{ user:result });
};

const getUserById = async (req, res) => {
    const { userID } = req.params;
    const user = await User.findOne({ where: { user_id: userID } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const result = {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        program_studi_id: user.program_studi_id,
        fakultas_id: user.fakultas_id
    };

    res.json({ user: result });
};

const addUser = async (req, res) => {
    const data = req.body;
    const hashed_password = bcrypt.hashSync(data.password, 10);

    const newUser = await User.create({
        user_id: data.user_id,
        username: data.username,
        password: hashed_password,
        role: data.role,
        program_studi_id: data.program_studi_id,
        fakultas_id: data.fakultas_id
    });

    res.json({ message: 'User added successfully' });
};

const updateUser = async (req, res) => {
    const { userID } = req.params;
    const data = req.body;

    const user = await User.findOne({ where: { user_id: userID } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.username = data.username || user.username;
    user.password = bcrypt.hashSync(data.password, 10) || user.password;
    user.role = data.role || user.role;
    user.program_studi_id = data.program_studi_id || user.program_studi_id;
    user.fakultas_id = data.fakultas_id || user.fakultas_id;

    await user.save();
    res.json({ message: 'User updated successfully' });
};

const deleteUser = async (req, res) => {
    const { userID } = req.params;

    const user = await User.findOne({ where: { user_id: userID } });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
};

module.exports = {
    index,
    getUser,
    getUserById,
    addUser,
    updateUser,
    deleteUser
};
