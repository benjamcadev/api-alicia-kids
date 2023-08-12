import jwt from 'jsonwebtoken'

//Clave secreta
const secret = process.env.SECRET_KEY_JWT;

const token = (user) => {

    jwt.sign({id: user.dataValues.id_usuario})
}


