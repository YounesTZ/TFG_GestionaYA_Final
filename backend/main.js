require('dotenv').config();
const express = require('express');
const { sequelize } = require('./User');
const userRoutes = require('./userController');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const secret = process.env.JWT_SECRET;
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
    if (req.path == '/register' || req.path == '/login') {
        return next();
    }
    
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], secret);
        next();
    } catch(error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}

app.use(verifyJWT);


app.post('/login', userRoutes.loginUser);
app.post('/register', userRoutes.registerUser);
app.get('/verify-token', userRoutes.verifyToken);
app.get('/profile', userRoutes.getProfileInfo);
app.put('/update-email', userRoutes.updateEmail);
app.delete('/delete-user', userRoutes.deleteUser);

// Sincronización con la base de datos
sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
        app.listen(3000, () => console.log('Server running on port 3000'));
    })
    .catch((error) => console.error('Unable to connect to the database:', error));
