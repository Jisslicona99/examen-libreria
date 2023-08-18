const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const mongoConnection =
  "mongodb+srv://jisserylr:jisserylr5@clusterj.qftudkn.mongodb.net/Libreria?retryWrites=true&w=majority";

mongoose
  .connect(mongoConnection)
  .catch((err) => console.error("Error de conexión a la base de datos:", err));

const sucursalSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { collection: "Sucursales" }
);

const Sucursales = mongoose.model("Sucursales", sucursalSchema);

router.get("/sucursales/all", async (req, res) => {
  try {
    const sucursales = await Sucursales.find().exec();
    res.status(200).json(sucursales);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error en la base de datos 500");
  }
});

const ObjectId = mongoose.Types.ObjectId;

router.post("/sucursales", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.body.user)) {
      return res.status(400).send("El valor de 'user' no es válido");
    }

    const newBranch = new Sucursales({
      branchName: req.body.branchName,
      image: req.body.image,
      user: req.body.user,
    });
    const savedBranch = await newBranch.save();
    res.status(201).json(savedBranch);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el server");
  }
});

router.put("/sucursales/:branchId", async (req, res) => {
  try {
    const updatedBranch = {
      branchName: req.body.branchName,
      image: req.body.image,
      user: req.body.user,
    };

    const branch = await Sucursales.findByIdAndUpdate(
      req.params.branchId,
      updatedBranch,
      {
        new: true,
      }
    );

    if (branch) {
      res.status(200).json(branch);
    } else {
      res.status(404).send("Sucursal no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
});

router.delete("/sucursales/:id", async (req, res) => {
  try {
    const branch = await Sucursales.findByIdAndDelete(req.params.id);
    if (branch) {
      res.status(200).json({ message: "Sucursal eliminado exitosamente" });
    } else {
      res.status(404).send("Sucursal no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en la base de datos (delete)");
  }
});

module.exports = router;
