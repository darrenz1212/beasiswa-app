// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const { sequelize } = require('./models');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const prodiRoutes = require('./routes/prodiRoutes');
const fakultasRoutes = require('./routes/fakultasRoutes');
const { requireAuth } = require('./middleware/auth');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(flash());

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
app.use('/admin', requireAuth, adminRoutes);
app.use('/mahasiswa', requireAuth, mahasiswaRoutes);
app.use('/fakultas', requireAuth, fakultasRoutes);
app.use('/prodi', requireAuth, prodiRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
