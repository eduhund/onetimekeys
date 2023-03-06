require("dotenv").config();

const express = require("express");

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

const { oneTimeKeys } = require("./otkMachine");

app.post("/set_otk", (req, res) => {
  const user = req.body;
  const secureKey = oneTimeKeys.setKey(user);
  if (secureKey) {
    res.status(200);
    res.send({ OK: true, data: secureKey });
  } else {
    res.status(400);
    res.send({ OK: false, error: "otk not generated" });
  }
});

//Admin API. Генерация ссылки для сброса пароля.
app.get("/check_otk", (req, res) => {
  const key = req.query.key;
  const result = oneTimeKeys.checkKey(key);
  res.status(200);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
