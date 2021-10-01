const express = require("express");

const app = express();
const port = 5000;

const path = require("path");
const { spawn } = require("child_process");
const bodyParser = require("body-parser");
const cors = require("cors");
const { htmlToText } = require("html-to-text");

const filesFolder = "./web_pages/";
const fs = require("fs");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {});

app.get("/page/:id", (req, res) => {
  res.sendFile(path.join(__dirname + "/web_pages/" + `${req.params.id}`));
});

app.get("/send/:query", (req, res) => {
  let arr = [];
  fs.readdirSync(filesFolder).forEach((file) => {
    arr.push(file);
  });

  console.log(arr);

  const childPython = spawn("python", [
    "python/neural_algorithm.py",
    arr,
    req.params.query,
  ]);

  childPython.stdout.on("data", (data) => {
    console.log(data.toString());
    fileNames = data
      .toString()
      .replace(/[&[\]\/\\#,+()$~%'":*?<>{}]/g, "")
      .trim()
      .split(" ");
    const filtered = fileNames.filter((elem) => elem !== "renault.html");
    const allFilesTitles = filtered.map((name) => {
      const files = fs.readFileSync(__dirname + "/web_pages/" + `${name}`);
      const text = htmlToText(files.toString(), {
        baseElement: "title",
      });
      const fileObject = {};
      fileObject[text] = name;
      return fileObject;
    });
    res.status(200).json(allFilesTitles);
    // res.status(200).json();
  });
});

app.listen(port, () => {});
