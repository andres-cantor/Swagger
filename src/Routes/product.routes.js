import { Router } from "express";

const router = Router();

// importar funciones del conrtrolador
//getProducts, getProductById.....
import {
    getProducts,
    getProductById,
    createProduct
} from "./controllers/product.controller.js";

//middleware
import {auth} from "../middlewares/auth.middleware.js";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Retorna una lista de todos los productos disponibles
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: number
 *       500:
 *         description: Error del servidor
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     description: Retorna un producto específico según su ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 nombre:
 *                   type: string
 *                 precio:
 *                   type: number
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Crea un nuevo producto. Requiere autenticación con token válido
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Teclado
 *               precio:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 nombre:
 *                   type: string
 *                 precio:
 *                   type: number
 *       403:
 *         description: No autorizado - token ausente o inválido
 *       400:
 *         description: Datos incompletos o inválidos
 */
//rutas protegidas
router.post("/", auth, createProduct);

export default router;

/*
import {getProducts} from "./product.routes"; --- logica
reuter.get("/", getProducts); --- anclaje
*/









