const fs = require('fs');
const Pizza = require("../models/Pizza");
const Topping = require("../models/Topping");
const mongoose = require("mongoose");

const connectDb = async () => {
  const db = mongoose.connection;

  db.once("open", (_) => {
    console.log("Connected to the database");
  });

  db.on("error", (err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

  await mongoose.connect("mongodb://127.0.0.1:27017/webshop", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  return db;
};
connectDb();

const jsonFilePath = '../data/' + 'data.json';

let jsonData;
try {
    let data = fs.readFileSync(jsonFilePath);
    jsonData = JSON.parse(data);
} catch (err) {
    console.error(err);
}

const pizzaArray = jsonData.pizza
const toppingArray = jsonData.topping

const fill = async _ => {
    for (const p of pizzaArray) {
        delete p.id;
        const newPizza = new Pizza({...p});
        await newPizza.save()
    }
    
    for (const t of toppingArray) {
        delete t.id;
        const newTopping = new Topping({...t});
        await newTopping.save()
    }

    process.exit(1);
}

fill();
