/*---------------------------------------------------------------------------

- NODEJS-4 : get,post method
- 2025.02.

---------------------------------------------------------------------------*/

// module : https://www.npmjs.com
var bodyParser = require("body-parser"); // POST,https://github.com/expressjs/body-parser#readme
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

// post method
app.use(express.urlencoded({ extended: true })); // For form post method
app.use(express.json()); // For parsing JSON data

/*---------------------------------------------------------------------------
  Start route
---------------------------------------------------------------------------*/

app.get("/", (req, res) => {
  //res.send('Hello, World!');
  res.sendFile(path.join(__dirname, "/html", "/index.html"));

  console.log("log:index1.html");
  console.log(`log: filename : ${__filename}`); // server.js
  console.log(`log: path:${__dirname}`); // directory path
});

app.get("/view1", (req, res) => {
  res.render("view1"); // ejs file
});

app.get("/get1", (req, res) => {
  const id = req.query.id;
  console.log(`id: ${id}`);
  res.render("get1", { fid: id }); // ejs file
});

//---------------------------------------------------------------

app.get("/form", (req, res) => {
  res.send(`
      <form method="POST" action="/formProc">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name"><br><br>

          <label for="email">Email:</label>
          <input type="email" id="email" name="email"><br><br>
          <button type="submit">Submit</button>
      </form>
  `);
});

app.post("/formProc", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  console.log(`form name : ${name}`);
  console.log(`form email : ${email}`);
  res.render("post1", { fname: name, femail: email });
});

//---------------------------------------------------------------
app.get("/formapi", (req, res) => {
  res.send(`
      <form method="POST" action="/api">
          <label for="api">API</label><br><br>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name"><br><br>

          <label for="email">Email:</label>
          <input type="email" id="email" name="email"><br><br>
          <button type="submit">Submit</button>
      </form>
  `);
});

app.post("/api", (req, res) => {
  console.log("Received JSON data:", req.body);

  res.json({ message: "Data received successfully!", data: req.body }); // Send JSON response
});

/*---------------------------------------------------------------------------
  Start Server
---------------------------------------------------------------------------*/

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
