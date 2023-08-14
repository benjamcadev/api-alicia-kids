import jwt from 'jsonwebtoken'

//Clave secreta
const secret = process.env.SECRET_KEY_JWT;

export const createToken = (datosUser) => {

    return jwt.sign({id: datosUser.id_usuario}, secret,{
        expiresIn: '1h'
    })
}


