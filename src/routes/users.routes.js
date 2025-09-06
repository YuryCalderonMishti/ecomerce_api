import { Router } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const router = Router();

// Registro
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        console.log("📩 Datos recibidos en register:", req.body);

        if (!first_name || !last_name || !email || !age || !password) {
        return res
            .status(400)
            .json({ message: "Todos los campos son obligatorios" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
        }

        const hashedPassword = createHash(password);
        console.log("🔐 Password en hash:", hashedPassword);

        const newUser = await UserModel.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        });

        res
        .status(201)
        .json({ message: "Usuario registrado con éxito", user: newUser });
    } catch (error) {
        console.error("❌ Error en registro:", error.message);
        console.error(error.stack);
        res.status(500).json({ message: "Error en el servidor" });
    }
    });

    // Login con JWT
    router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("📩 Datos recibidos en login:", req.body);

        if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email y contraseña son obligatorios" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
        console.log("⚠️ Usuario no encontrado:", email);
        return res.status(400).json({ message: "Usuario no encontrado" });
        }

        console.log("👉 Password recibido:", password);
        console.log("👉 Hash guardado en BD:", user.password);

        if (!isValidPassword(password, user.password)) {
        console.log("❌ Contraseña incorrecta");
        return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        console.log("✅ Contraseña correcta");

        // Verificar JWT_SECRET
        console.log("🔑 JWT_SECRET usado:", process.env.JWT_SECRET);

        // Generar token JWT
        const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        console.log("🎟️ Token generado:", token);

        res.json({ message: "Login exitoso", token });
    } catch (error) {
        console.error("❌ Error en login:", error.message);
        console.error(error.stack);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

export default router;
