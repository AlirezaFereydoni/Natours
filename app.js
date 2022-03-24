const express = require("express");
const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const app = express();

app.use(express.json());

app.get("/api/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post("/api/tours", (req, res) => {
  const newId = tours[tours.length - 1].id++;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) {
      res.status(400).json({ status: "Fail", message: "Bad Request", data: {} });
    }

    res.status(200).json({
      status: "Success",
      data: newTour,
    });
  });
});

app.listen(8000, "127.0.0.1", () => {
  console.log("Server running ...");
});
