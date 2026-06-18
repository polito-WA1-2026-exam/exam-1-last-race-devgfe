// Imports
import express from "express";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";

import { authenticateSession } from "./services/auth-service.js";
import { ROUTES, APP_PORT } from "./config/config.js";

import authRouter from "./routes/auth-route.js";
import eventsRouter from "./routes/events-route.js";
import gamesRouter from "./routes/games-route.js";
import metroRouter from "./routes/metro-route.js";

// Init express
export const app = new express();

// Middlewares
app.use(express.json());

app.use(morgan("dev"));

app.use(cors({
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
}));

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false
}));

app.use(authenticateSession);

// Routes
app.use(ROUTES.V1_AUTH, authRouter);
app.use(ROUTES.V1_EVENTS, eventsRouter);
app.use(ROUTES.V1_GAMES, gamesRouter);
app.use(ROUTES.V1_METRO, metroRouter);

// Activate the server
app.listen(APP_PORT, () => {
  console.log(`Server listening at http://localhost:${APP_PORT}`);
});