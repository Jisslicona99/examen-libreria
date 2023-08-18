const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const mongoConnection =
  "mongodb+srv://jisserylr:jisserylr5@clusterj.qftudkn.mongodb.net/Libreria?retryWrites=true&w=majority";

mongoose.connect(mongoConnection).catch((err) => console.error("Error :", err));

const librosSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    branchName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branches",
      required: true,
    },
  },
  { collection: "Libros" }
);

const Libros = mongoose.model("Libros", librosSchema);

router.get("/libros/all", async (req, res) => {
  try {
    const libros = await Libros.find().exec();
    res.status(200).json(libros);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error  500");
  }
});

const ObjectId = mongoose.Types.ObjectId;

router.post("/libros", async (req, res) => {
  try {
    if (
      !ObjectId.isValid(req.body.user) &&
      !ObjectId.isValid(req.body.branch)
    ) {
      return res.status(400).send("El no es válido");
    }
    const newBook = new Libros({
      bookName: req.body.bookName,
      image: req.body.image,
      amount: req.body.amount,
      user: req.body.user,
      branchName: req.body.branchName,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

router.put("/libros/:id", async (req, res) => {
  try {
    const updatedBook = {
      bookName: req.body.bookName,
      image: req.body.image,
      amount: req.body.amount,
      user: req.body.user,
      branchName: req.body.branchName,
    };

    const libros = await Libros.findByIdAndUpdate(req.params.id, updatedBook, {
      new: true,
    });

    if (libros) {
      res.status(200).json(libros);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

router.delete("/libros/:id", async (req, res) => {
  try {
    const libros = await Libros.findByIdAndDelete(req.params.id);
    if (libros) {
      res.status(200).json({ message: "Libo eliminado" });
    } else {
      res.status(404).send("Error");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

module.exports = router;
