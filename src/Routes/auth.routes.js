import { Router } from "express";
import { hiddenLogin, validateToken } from "./controllers/auth.controller.js";

const router = Router();

/**
 * @swagger
 * /api/auth/hidden-login:
 *   post:
 *     summary: Login oculto - Autenticación de usuario
 *     description: Endpoint de login oculto para obtener un token de autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/hidden-login", hiddenLogin);

/**
 * @swagger
 * /api/auth/validate-token:
 *   post:
 *     summary: Validar token de autenticación
 *     description: Verifica si un token es válido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: 123ABC
 *     responses:
 *       200:
 *         description: Token válido
 *       403:
 *         description: Token inválido
 */
router.post("/validate-token", validateToken);

export default router;
