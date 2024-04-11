var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var secret = "7WgTB2qEfUG1oZGAMZfK4k3Nb3mh0xUd";
var bcrypt = require("bcrypt");

class UserController {
  async index(req, res) {
    var users = await User.findall();
    res.json(users);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.find(id);

    if (user == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    var { name, email, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.json({ err: "The email is invalid!" });
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "The email already exists!" });
      return;
    }

    await User.new(name, password, name);

    res.status(200);
    res.send("OK");
  }

  async edit(req, res) {
    var { id, name, role, email } = req.body;
    var result = await User.update(id, name, role, email);
    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("OK");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Server error");
    }
  }

  async remove(req, res) {
    var id = req.params.id;

    var result = await User.delete(id);

    if (result.status) {
      res.status(200);
      res.send("OK");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }
  async recoverPassword(req, res) {
    var email = req.body.email;
    var result = await PasswordToken.new(email);
    if (result.status) {
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;
    var isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      res.status(200);
      res.send("password changed");
    } else {
      res.status(406);
      res.send("Token invalid");
    }
  }

  async login(req, res) {
    var { email, password } = req.body;
    var user = await User.findByEmail(email);
    if (user != undefined) {
      var result = await bcrypt.compare(password, user.password);
      if (result) {
        var token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200);
        res.json({ token: token });
      } else {
        res.status(406);
        res.send("invalid password");
      }
    } else {
      res.json({ status: false });
    }
  }
}

module.exports = new UserController();
