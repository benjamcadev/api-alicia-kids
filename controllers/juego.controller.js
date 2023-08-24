import { Juego } from '../models/Juego.js'


export const getJuegos = async(req,res) => {
    const juegos = await Juego.findAll({
        where: {
            flag_delete_juego: false
        }
    })
    res.status(200).json(
        {
            status: 'success',
            juegos
        }
        );
}