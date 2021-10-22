import Express from "express";
import mysql from "mysql";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "next_gen_gds",
});
db.query("select now() as 'Session started at'", (err, res) => {
  if (err) {
    console.log(`Connection Failed!!`);
    console.log(err);
  } else {
    console.log(JSON.parse(JSON.stringify(res))[0]);
    console.log(`Connection Established!!`);
  }
});
const app = Express();
app.use(Express.json());
app.use(cors("*"));
app.get("/getPod", (req, res) => {
  const query = `select t1.name as podgroup,json_arrayagg(t2.name) as pod from pod_group as t1,pod as t2 where t1.id = t2.pod_group_fkid group by t1.name;`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      const resp = JSON.parse(JSON.stringify(response));
      const result = resp.map((val) => {
        return { podGroup: val.podGroup, pod: JSON.parse(val.pod) };
      });
      res.send(result);
    }
  });
});

// to refer build pages
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(Express.static(path.join(__dirname, "./frontend/build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build", "index.html"));
});
app.listen(8080, () => console.log(`http://localhost:${8080}`));
