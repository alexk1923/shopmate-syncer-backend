import pg from 'pg';
import { Sequelize } from 'sequelize-typescript';
import Barcode from '../models/barCodeModel.js';
import Inventory from '../models/inventoryModel.js';
import Store from '../models/storeModel.js';
import Food from '../models/foodModel.js';
import FoodType from '../models/foodTagModel.js';
import User from '../models/userModel.js';
import House from '../models/houseModel.js';
import Item from '../models/itemModel.js';

function connectToDatabase() {

  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    models: [Store, User, House, Inventory, Item, Barcode, Food, FoodType]
  });

  sequelize.sync({alter: true, force: true});
  
  console.log(process.cwd() + "/src/models");
  
  sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

}



export default connectToDatabase;