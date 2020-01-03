const jwt = require('jsonwebtoken');


// ======================
// ==  VERIFICAR TOKEN ==
// ======================


let verificaToken = (req, res, next) => {
    let token = req.get('token'); //puede llamarse token o authorization
    //console.log(token);

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        };
        req.usuario = decode.usuario;

        next();


    });

};


// ======================
// = VERIFICA ADMINROLE =
// ======================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    };



};

module.exports = {
    verificaToken,
    verificaAdmin_Role
};