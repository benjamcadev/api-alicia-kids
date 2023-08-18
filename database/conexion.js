import  Sequelize  from 'sequelize'
import 'dotenv/config'

import pg from 'pg'
const { types } = pg

//var types = require('pg').types;
var timestampOID = 1114;
types.setTypeParser(1114, function(stringValue) {
  return new Date( Date.parse(stringValue + "0000") );
});

export const sequelize = new Sequelize(
  process.env.DATABASE_NAME, 
  process.env.DATABASE_USERNAME, 
  process.env.DATABASE_PASSWORD, 
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres'
   
    
  }
  );


  
