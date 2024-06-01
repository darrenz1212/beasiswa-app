const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sequelize } = require('./models');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(error => {
        console.error('Unable to create tables, shutting down...', error);
        process.exit(1);
    });

// Register routes
app.use('/mahasiswa', mahasiswaRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.redirect('/mahasiswa');

});
app.get('/hai', (req, res) => {
    res.redirect('/mahasiswa');

});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
