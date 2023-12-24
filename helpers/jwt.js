import jwt from 'jsonwebtoken'

//Clave secreta
const secret = process.env.SECRET_KEY_JWT;

export const createToken = (datosUser) => {

    return jwt.sign({
        id: datosUser.id_usuario,
        nombre: datosUser.nombre_usuario,
        correo: datosUser.correo_usuario

    },
        secret,
        {
            expiresIn: '1h'
        })
}

export const verifyToken = (token) => {
    return jwt.verify(token, secret)
}


