var jwt = require("jsonwebtoken");
var secret = "7WgTB2qEfUG1oZGAMZfK4k3Nb3mh0xUd";

module.exports = (req, res, next) => {
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    var token = bearer[1];
    try {
      var decoded = jwt.verify(token, secret);
      if (decoded.role == 1) {
        next();
      } else {
        res.status(403);
        res.send("You are not has permission");
        return;
      }
    } catch (err) {
      res.status(403);
      res.json({ err: "Token invalid" });
      return;
    }
  } else {
    res.status(403);
    res.json({ err: "Token invalid" });
    return;
  }
};
