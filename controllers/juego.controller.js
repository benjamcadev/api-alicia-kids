import { Juego } from '../models/Juego.js'


export const getJuegos = async(req,res) => {
    const juegos = await Juego.findAll({
        where: {
            flag_delete_juego: false
        }
    })

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials" : "true" 
    });

    res.status(200).json(
        {
            status: 'success',
            juegos
        }
        );
}