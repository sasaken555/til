const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const uuid = require("uuid/v4");

const USER_TYPE_CONSUMER = "1";
const USER_TYPE_COMPANY = "2";

/* GET users listing. */
router.get("/", (req, res) => {
  res.send("respond with a resource");
});

router.post(
  "/",
  [
    check("userName").exists(),
    check("age")
      .exists()
      .isInt(),
    check("email").isEmail(),
    check("userType")
      .exists()
      .isIn([USER_TYPE_CONSUMER, USER_TYPE_COMPANY])
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const userId = uuid();
    const { userName, nickName, age, email, userType } = req.body;
    const ts = new Date().toISOString();

    const user = {
      userId,
      userName,
      nickName,
      age,
      email,
      userType,
      createdDate: ts,
      updatedDate: ts
    };
    console.log("user created:", user);

    res.status(201).json({ userId });
  }
);

module.exports = router;
