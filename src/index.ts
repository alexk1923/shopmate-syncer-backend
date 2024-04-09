import dotenv from "dotenv"
dotenv.config();
import express from "express";
import usersRoutes from "./routes/userRoutes.js"

const app = express();
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { env } from "process";
import connectToDatabase from "./db/dbConfig.js";

app.use("/api/", usersRoutes);

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'REST API Docss',
        version: '1.0.0',
      },
    },
    apis: ['./src/routes/*.ts'], // files containing annotations as above
  };

const openapiSpec = swaggerJsdoc(options);

const port = env.PORT || 3000;
app.listen(port, () => {  
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
    console.log(`Server started on port ${port}.`); 
    connectToDatabase();
});

