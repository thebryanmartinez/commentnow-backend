const ObjectId = require("mongodb").ObjectId;
const getDb = require("../mongodb");
const bcrypt = require("bcryptjs");

let db = null;
class Usuarios {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        this.collection = db.collection("Usuarios");
        if (process.env.MIGRATE === "true") {
          this.collection
            .createIndex({ username: 1 }, { unique: true })
            .then((rslt) => {
              console.log("Indice creado satisfactoriamente", rslt);
            })
            .catch((err) => {
              console.error("Error al crear el indice de username", err);
            });

          this.collection
            .createIndex({ email: 1 }, { unique: true })
            .then((rslt) => {
              console.log("Indice creado satisfactoriamente", rslt);
            })
            .catch((err) => {
              console.error("Error al crear el indice de email", err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async new(names, username, email, description, birthdate, password, recoveryQuestion, recoveryAnswer, roles = []) {
    const newUsuario = {
      names,
      username,
      email,
      description,
      birthdate,
      password: await this.hashPassword(password),
      roles: [...roles, "public"],
      passwordRecovery: {
        question: recoveryQuestion,
        answer: await this.hashPassword(recoveryAnswer),
      },
    };
    return await this.collection.insertOne(newUsuario);
  }

  async getAll() {
    const cursor = this.collection.find({});
    return await cursor.toArray();
  }

  async getFaceted(page, items, filter = {}) {
    const cursor = this.collection.find(filter);
    const totalItems = await cursor.count();
    cursor.skip((page - 1) * items);
    cursor.limit(items);
    const resultados = await cursor.toArray();
    return {
      totalItems,
      page,
      items,
      totalPages: Math.ceil(totalItems / items),
      resultados,
    };
  }

  async getById(id) {
    const _id = new ObjectId(id);
    const filter = { _id };
    console.log(filter);
    return await this.collection.findOne(filter);
  }

  async getByUsername(username) {
    const filter = { username };
    return await this.collection.findOne(filter);
  }

  async hashPassword(rawPassword) {
    return await bcrypt.hash(rawPassword, 10);
  }

  async comparePassword(rawPassword, dbPassword) {
    return await bcrypt.compare(rawPassword, dbPassword);
  }

  async hashRecoveryAnswer(rawRecoveryAnswer) {
    return await bcrypt.hash(rawRecoveryAnswer, 10);
  }

  async compareRecoveryAnswer(rawRecoveryAnswer, dbRecoveryAnswer) {
    return await bcrypt.compare(rawRecoveryAnswer, dbRecoveryAnswer);
  }

  async getUserRecoveryAnswer(username) {
    const filter = { username };
    const user = await this.collection.findOne(filter);
    return user.passwordRecovery.answer;
  }

  async updateEmail(id, email) {
    const filter = { _id: new ObjectId(id) };
    const updateCmd = {
      $set: {
        email,
      },
    };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async updateUsername(id, username) {
    const filter = { _id: new ObjectId(id) };
    const updateCmd = {
      $set: {
        username,
      },
    };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async updatePassword(username, password) {
    const filter = { username };
    const updateCmd = {
      $set: {
        password: await this.hashPassword(password),
      },
    };
    return await this.collection.updateOne(filter, updateCmd);
  }

  async deleteUser(id) {
    const filter = { _id: new ObjectId(id) };
    return await this.collection.deleteOne(filter);
  }
}

module.exports = Usuarios;
