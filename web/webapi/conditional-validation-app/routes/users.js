const express = require("express");
const router = express.Router();
const { body, param, validationResult } = require("express-validator");
const uuid = require("uuid/v4");

const USER_TYPE_CONSUMER = "1";
const USER_TYPE_COMPANY = "2";

/* GET users listing. */
router.get(
  "/:userId",
  [
    param("userId")
      .exists()
      .isUUID(4)
  ],
  (req, res) => {
    const userId = req.params.userId;
    const ts = new Date().toISOString();

    res.json({
      userId,
      userName: "hoge",
      nickName: "fuga-fuga-fuga",
      age: 31,
      email: "piyo-piyo-hokekyo@po.uk",
      userType: USER_TYPE_CONSUMER,
      createdDate: ts,
      updatedDate: ts
    });
  }
);

/* POST user creation */
router.post(
  "/",
  [
    body("userName").exists(),

    body("nickName").isLength({ min: 10 }),

    body("age")
      .exists()
      .isInt()
      .custom(age => age > 0),

    body("email").isEmail(),

    body("userType")
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
