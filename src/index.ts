import dotenv from "dotenv";
dotenv.config();
import express from "express";
import usersRoutes from "./routes/userRoutes.js";
import houseRoutes, { HouseSchema } from "./routes/houseRoutes.js";

const app = express();
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "process";
import connectToDatabase from "./db/dbConfig.js";
import bodyParser from "body-parser";
import { errorHandler } from "./errors/errorHandler.js";
import { houseApi } from "./routes/houseRoutes.js";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/", usersRoutes);
app.use("/api/", houseRoutes);
app.use(errorHandler);

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "REST API Docss",
			version: "1.0.0",
		},
		paths: {
			...houseApi,
		},
		components: {
			schemas: { HouseSchema },
		},
	},
	swaggerOptions: {
		basicAuth: {
			name: "Authorization",
			schema: {
				type: "bearer",
				in: "header",
			},
			value: "Bearer <token>",
		},
	},
	apis: ["./src/routes/*.ts"], // files containing annotations as above
};

const openapiSpec = swaggerJsdoc(options);

const port = env.PORT || 3000;
app.listen(port, () => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
	console.log(`Server started on port ${port}.`);
	connectToDatabase();
});
