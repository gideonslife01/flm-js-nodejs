/*---------------------------------------------------------------------------

- NODEJS-4 : get method
- 2025.02.

---------------------------------------------------------------------------*/

// module : https://www.npmjs.com
const ejs = require("ejs"); // https://ejs.co
const path = require("path"); // https://nodejs.org/docs/latest/api/path.html
const express = require("express"); // https://expressjs.com/

const app = express();
const port = 3000;

// ejs
app.set("view engine", "ejs");
app.set("views", "./public");

// static directory
// app.use(express.static(path.join(__dirname, "public")));

/*---------------------------------------------------------------------------
  Start route
---------------------------------------------------------------------------*/

app.get("/", (req, res) => {
  //res.send('Hello, World!');
  res.sendFile(path.join(__dirname, "/html", "/index.html")); // html directory,index.html

  console.log("log:index1.html");
  console.log(`log: filename : ${__filename}`); // server.js
  console.log(`log: path:${__dirname}`); // directory path
});

app.get("/view1", (req, res) => {
  res.render("view1"); // ejs file
});

app.get("/get1", (req, res) => {
  const id = req.query.id;
  const name = req.query.name;

  console.log(`id: ${id}`);
  console.log(`name : ${name}`);
  res.render("get1", { fid: id, fname: name });
});

/*---------------------------------------------------------------------------
  Start Server
---------------------------------------------------------------------------*/

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
