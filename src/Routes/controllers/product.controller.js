// import
import products from "../../data/products.js";


// obtener todos los productos
export const getProducts = (req, res) =>{
    res.json(products);
};

// obtener productos por ID
export const getProductById = (req, res) =>{
    const id = Number(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({message: "producto no encontrado"});
    }
    //Definir el formato de la entrega
    res.json(product);
};

// crear producto
export const createProduct = (req, res) =>{
    //estructura
    const newProduct = {
        id: products.length +1,
        nombre: req.body.nombre,
        precio: req.body.precio
    };
    products.push(newProduct);

    res.status(201).json(newProduct);
};










