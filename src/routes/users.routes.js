import { Router } from "express";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const router = Router();

const users = [];

// Registro
router.post("/register", (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = createHash(password);

    users.push({ username, password: hashedPassword });
    res.json({ message: "Usuario registrado con éxito" });
});

// Login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

  // Aquí usamos tu función
    if (!isValidPassword(password, user.password)) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    res.json({ message: "Login exitoso" });
});

export default router;
