import express from "express";
import cors from "cors";
import session, { Store } from "express-session";
import sequelizeStore from "connect-session-sequelize";
import db from "./config/Database.js";
import FileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();
// router
import userRoute from "./routes/userRoute.js";
import portfolioRoute from "./routes/portfolioRoute.js";
import authRoute from "./routes/authRoute.js";
// model
// import User from "./models/UserModel.js";
// import Portfolio from "./models/portfolioModel.js";

const app = express();

const sessionStore = sequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: false,
    },
  })
);

app.use(express.static("public"));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(FileUpload());
app.use(authRoute);
app.use(userRoute);
app.use(portfolioRoute);

// (async () => {
//   await Portfolio.sync({ alter: true });
// })();

app.listen(4000, () => {
  console.info("Server up and running....");
});
