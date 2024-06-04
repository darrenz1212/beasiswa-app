const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { sequelize } = require('./models');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Konfigurasi sesi
app.use(session({
    secret: 'secret_key', // Ubah 'secret_key' ke nilai yang lebih aman
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Gunakan secure: true jika menggunakan HTTPS
}));

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(error => {
        console.error('Unable to create tables, shutting down...', error);
        process.exit(1);
    });

// Register routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/auth',authRoutes);


app.get('/', (req, res) => {
    res.redirect('/auth');
});


app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
