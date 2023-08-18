const express = require("express");
const usuarios = require("./usuarios");
const libros = require("./libros");
const sucursales = require("./sucursales");

const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(3000, () => {
  console.log("La aplicación está funcionando en el puerto 3000");
});

app.use("/", usuarios);
app.use("/", libros);
app.use("/", sucursales);
