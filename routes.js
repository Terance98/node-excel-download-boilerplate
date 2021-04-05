const express = require("express");
const router = express.Router();
const controller = require("./controller");

let routes = (app) => {
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.get("/excel", controller.generateExcel);

  app.use(router);
};

module.exports = routes;
