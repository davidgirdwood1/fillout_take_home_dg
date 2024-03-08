// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { fetchFilteredResponse } from "./forms/filteredResponse";

/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config();

/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({extended: true}));

/* Define a route for the take home challenge */
app.get('/:formId/filteredResponses', fetchFilteredResponse);

/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Dave's Express + TypeScript Server");
});

/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
