const express = require("express");
const router = new express.Router();
const db = require('../db.js');
const ExpressError = require("../expressError.js")

/** GET /company: get list of companies */
router.get("/", function(req, res, next) {
  return res.json("Company route is working");
});

module.exports = router;