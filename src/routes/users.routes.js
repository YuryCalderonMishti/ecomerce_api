import { Router } from "express";
import UserModel from "../models/User.js"; 
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const router = Router();

// Registro
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Validar campos obligatorios
        if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si ya existe el usuario
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Hashear la contraseña
        const hashedPassword = createHash(password);

        // Crear el usuario en la BD
        const newUser = await UserModel.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        });

        res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
    });

    // Login
    router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        // Buscar usuario por email
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        // Validar contraseña
        if (!isValidPassword(password, user.password)) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        res.json({ message: "Login exitoso", user });
    } catch (error) {
        console.error(" Error en login:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

export default router;

