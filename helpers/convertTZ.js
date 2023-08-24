
const subtractHours = (date, hours) => {
    date.setHours(date.getHours() - hours);
  
    return date;
  }

export const convertTZOneDate = (fecha) => {
  const fechaUtcDate = new Date(fecha)
  const fechaSantiago = subtractHours(fechaUtcDate, 4)
  return fechaSantiago

} 

export const convertTZ = (reservas) => {
    reservas.forEach((element, index) => {
        //console.log(element.dataValues);
         const { fecha_inicio_reserva: fechaUtcInicio, fecha_termino_reserva: fechaUtcTermino } = element.dataValues
         const fechaUtcDateInicio = new Date(fechaUtcInicio)
         const fechaUtcDateTermino = new Date(fechaUtcTermino)
         const fechaSantiagoInicio = subtractHours(fechaUtcDateInicio, 4)
         const fechaSantiagoTermino = subtractHours(fechaUtcDateTermino, 4)
         element.dataValues.fecha_inicio_reserva = fechaSantiagoInicio
         element.dataValues.fecha_termino_reserva = fechaSantiagoTermino

     })

     return reservas
}