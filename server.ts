import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import * as Middlewares from "./src/middlewares";
import * as Routers from "./src/routers";
import * as Constants from "./src/globals/constants";

const app = express();

// Middlewares
app
  .use(cors({ origin: "*" }))
  .use(helmet())
  .use(morgan("dev"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

// Routers
app.use(`${Constants.System.ROOT}/`, Routers.Health);
app.use(`${Constants.System.ROOT}/candidate`, Routers.Candidate);
app.use(`${Constants.System.ROOT}/comments`, Routers.Comments);
app.use(`${Constants.System.ROOT}/exitpoll`, Routers.ExitPoll);
app.use(`${Constants.System.ROOT}/like`, Routers.Like);
app.use(`${Constants.System.ROOT}/option`, Routers.Option);
app.use(`${Constants.System.ROOT}/position`, Routers.Position);
app.use(`${Constants.System.ROOT}/post`, Routers.Post);
app.use(`${Constants.System.ROOT}/user`, Routers.User);
app.use(`${Constants.System.ROOT}/vote`, Routers.Vote);
// Error Handlers
app.use(Middlewares.Error.errorHandler);

app.listen(Constants.System.PORT, () => {
  console.log(`Server started on port ${Constants.System.PORT}`);
});
