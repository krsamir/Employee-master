import Express from "express";
import mysql from "mysql";
import path from "path";
import { fileURLToPath } from "url";

const db = mysql.createPool({
  host: "localhost",
  user: "ggsusers",
  password: "dTF#%MeER3V0",
  database: "surveybsh_ggs",
  port: 55002,
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

app.get("/getemp", (req, res) => {
  const query = `select * from employee_master`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ length: response.length, response });
    }
  });
});

app.post("/create", (req, res) => {
  const body = req.body;
  const query = `insert into employee_master (employee_code, employee_name, work_location, department, head_of_function, spoc) values ?`;
  db.query(
    query,
    [
      body.map((value) => [
        value.empCode,
        value.empName,
        value.location,
        value.dept,
        value.hof,
        value.spoc,
      ]),
    ],
    (err, response) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ rows: response.affectedRows, id: response.insertId });
      }
    }
  );
});

app.put("/update", (req, res) => {
  const { empCode, empName, location, dept, hof, spoc, id } = req.body;
  const query = `update employee_master set employee_code = '${empCode}', employee_name = '${empName}', work_location = '${location}', department = '${dept}', head_of_function = '${hof}', spoc = '${spoc}' where (id = '${id}');`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ rows: response.affectedRows });
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = `delete from employee_master where (id = '${id}')`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ rows: response.affectedRows });
    }
  });
});
app.get("/department", (req, res) => {
  const query = `select id,department from employee_master group by department order by department asc`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ length: response.length, response });
    }
  });
});

// app.get("/department", (req, res) => {
//   const query = `select id,department from employee_master group by department order by department asc`;
//   db.query(query, (err, response) => {
//     if (err) {
//       console.log(err);
//       res.send(err);
//     } else {
//       res.send({ length: response.length, response });
//     }
//   });
// });

app.get("/head", (req, res) => {
  const query = `select id,head_of_function from employee_master group by head_of_function order by head_of_function asc`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ length: response.length, response });
    }
  });
});

app.get("/location", (req, res) => {
  const query = `select id,work_location from employee_master group by work_location order by work_location asc`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ length: response.length, response });
    }
  });
});

app.get("/spoc", (req, res) => {
  const query = `select id,spoc from employee_master group by spoc order by spoc asc`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ length: response.length, response });
    }
  });
});
// app.get("/spoc", (req, res) => {
//   const query = `select id,spoc from employee_master group by spoc order by spoc asc`;
//   db.query(query, (err, response) => {
//     if (err) {
//       console.log(err);
//       res.send(err);
//     } else {
//       res.send({ length: response.length, response });
//     }
//   });
// });
app.get("/byhof/:hof", (req, res) => {
  const query = `select id,work_location,department,head_of_function,spoc from employee_master where head_of_function like ('%${req.params.hof}%') group by department`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ length: response.length, response });
    }
  });
});
app.get("/byspoc/:spoc", (req, res) => {
  const query = `select id,work_location,department,head_of_function,spoc from employee_master where spoc like ('%${req.params.spoc}%') group by work_location`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ length: response.length, response });
    }
  });
});

app.get("/audit", (req, res) => {
  const query = `select * from audit_logs  order by id desc`;
  db.query(query, (err, response) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send({ response });
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
app.listen(5002, () => console.log(`http://localhost:${5002}`));
