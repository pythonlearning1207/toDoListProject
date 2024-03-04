import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'permalist',
  password: 'Jia3202128',
  port: 5432,
})
db.connect();

async function checkList(){
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  const data = result.rows;
  items = data;
  let dateinfo = new Date();
  let formattedDate = dateinfo.toLocaleDateString('en-US');
  date = formattedDate;
}
let date;
let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  await checkList();
  res.render("index.ejs", {
    listTitle: date,
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  try {
    const item = req.body.newItem;
    db.query("INSERT INTO items(title) VALUES($1);", [item]);
    console.log("item added succesfully");
    res.redirect("/");
  } catch (error) {
    console.log("not added");
  }
});

app.post("/edit", (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  try {
    db.query("UPDATE items SET title = $1 WHERE id = $2;",
              [title, id]
    );
    console.log("Item updated");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});
app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId;
  db.query("DELETE FROM items WHERE id = $1;", [id]);
  console.log("record deleted");
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
