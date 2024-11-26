require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { User } = require('./User');

const saltRounds = 10;
const secret = process.env.JWT_SECRET;

/**
 * Login de usuario.
 */
const loginUser = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const user = await User.findOne({ where: { correo } });
        if (!user) {
            return res.status(401).json({ message: 'Email does not exist' });
        }

        const hash = await bcrypt.hash(password, user.salt);
        if (hash !== user.hash_clave) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user.id, correo: user.correo }, secret);
        return res.json({ token, user: toUserDTO(user) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Registro de usuario.
 */
const registerUser = async (req, res) => {
    const { nombre, apellidos, correo, documentacion, telefono, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { correo } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const existingEmail = await User.findOne({ where: { correo: correo } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const user = await User.create({
            nombre,
            apellidos,
            correo,
            documentacion,
            telefono,
            hash_clave: hash,
            salt,
        });

        return res.json({ message: 'User registered successfully', user: toUserDTO(user) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Verifica el token JWT.
 */
const verifyToken = async (req, res) => {
    const token = req.header('Authorization');
    try {
        const data = jwt.verify(token, secret);
        return res.status(200).json({ message: 'Valid token', data });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

/**
 * Obtiene la información de perfil.
 */
const getProfileInfo = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extraer el token del encabezado
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, secret);
        const { correo } = decoded; // Extraer el username del token

        // Buscar al usuario en la base de datos
        const user = await User.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Mapeo del usuario al DTO
        const userDTO = toUserDTO(user);

        // Devolver la información del usuario sin datos sensibles
        return res.json(userDTO);
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

/**
 * Actualiza el correo electrónico de un usuario.
 * @param {Object} req - El objeto de la solicitud.
 * @param {Object} res - El objeto de la respuesta.
 */
const updateEmail = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const { correo } = req.body;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    if (!correo) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        const oldCorreo  = decoded.correo;
        const user = await User.findOne({ where: { correo: oldCorreo } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingEmail = await User.findOne({ where: { correo: correo } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        
        if (!validator.isEmail(correo)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        user.correo = correo;
        await user.save();

        return res.json({ message: 'Email updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Elimina un usuario autenticado.
 * @param {Object} req - El objeto de la solicitud.
 * @param {Object} res - El objeto de la respuesta.
 */
const deleteUser = async (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        const { correo } = decoded;

        const user = await User.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Mapea un usuario al DTO para excluir información sensible.
 * @param {Object} user - El objeto del usuario desde la base de datos.
 * @returns {Object} El UserDTO con los campos seguros.
 */
const toUserDTO = (user) => {
    return {
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        documentacion: user.documentacion,
        telefono: user.telefono,
    };
};

module.exports = {
    loginUser,
    registerUser,
    verifyToken,
    getProfileInfo,
    updateEmail,
    deleteUser
};
