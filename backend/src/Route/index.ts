// src/Route/index.ts
import express from "express";
import POHeaderRoute from "./HeaderRoute.js";
import Detail1Route from "./Detail1Route.js";
import Detail2Route from "./Detail2Route.js";
import Detail3Route from "./Detail3Route.js";
import Detail4Route from "./Detail4Route.js";



const Router = express.Router();
Router.use("/header",POHeaderRoute);
Router.use("/detail1",Detail1Route);
Router.use("/detail2",Detail2Route);
Router.use("/detail3",Detail3Route);
Router.use("/detail4",Detail4Route);
export default Router;