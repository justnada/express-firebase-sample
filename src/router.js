import express from "express";
import {
  get,
  getDatabase,
  orderByKey,
  query,
  ref,
  remove,
  set,
} from "firebase/database";
import fire from "./firebase.js";
import Message from "./model/Message.js";

const router = express.Router();
const database = getDatabase(fire);

router.post("/api/user", (req, res) => {
  const { username, fullname, address, age, birth_date, is_married } = req.body;
  let id = Date.now();
  const payload = {
    id: id,
    username,
    fullname,
    address,
    age,
    birth_date,
    is_married,
  };

  set(ref(database, "users/" + id), payload)
    .then(() => {
      res.status(201).send(new Message("success", "success create user", id));
    })
    .catch((err) => {
      res.status(500).send(new Message("failed", err.message, null));
    });
});

router.get("/api/users", async (req, res) => {
  await get(query(ref(database, "users/"), orderByKey()))
    .then((response) => {
      let temp = response.val();
      const users = [];

      for (let key in temp) {
        users.push({ ...temp[key], id: key });
      }

      res.status(200).send(new Message("success", "success get users", users));
    })
    .catch((err) =>
      res.status(500).send({ status: "failed", message: err.message })
    );
});

router.get("/api/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = (await get(ref(database, "users/" + id))).val();

  if (user === null) {
    res.status(404).send(new Message("failed", "user not found", user));
  } else {
    res.status(200).send(new Message("success", "success get user", user));
  }
});

router.put("/api/user/:id", async (req, res) => {
  const { username, fullname, address, age, birth_date, is_married } = req.body;
  const { id } = req.params;

  const payload = { username, fullname, address, age, birth_date, is_married };

  set(ref(database, "users/" + id), payload)
    .then(() => {
      res.status(202).send(new Message("sucess", "success update user", id));
    })
    .catch((err) => {
      res.status(500).send(new Message("failed", err.message, null));
    });
});

router.delete("/api/user/:id", (req, res) => {
  const { id } = req.params;

  remove(ref(database, "users/" + id))
    .then(() => {
      res
        .status(202)
        .send(
          new Message("sucess", `success delete user with id '${id}'`, null)
        );
    })
    .catch((err) => {
      res.status(500).send(new Message("failed", err.message, null));
    });
});

export default router;
