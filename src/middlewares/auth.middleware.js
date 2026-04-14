export const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (token !== "123ABC"){
        return res.status(403).json({message: "No autorizado"});    
    }
    next();
};

//un middleware es un filtro antes de llegar al endpoint

/*
Get http://localost:3000/api/products

POST http://localhost:300/api/products

body
{
    "name": "Teclado",
    "price": 100    
}
-header
    -API auth
        authorzation: 123ABC <-
*/



