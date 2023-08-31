const express = require("express");
const router = new express.Router();
const db = require('../db.js');
const ExpressError = require("../expressError.js");
const { database } = require("pg/lib/defaults.js");

/** GET /industries: get list of industries */
router.get("/", async function(req, res, next) {
    try{
        const results = await db.query(`SELECT * FROM industries`);
        return res.json({industries: results.rows})
    }
    catch(error){
        return next(error);
    }
});

/**GET /industries/[code]: get specific industry */
router.get("/:code", async function(req,res,next){
    try{
        const result = await db.query(
            `SELECT * FROM industries 
            WHERE code = $1`, [req.params.code]);
        if(!result.rowCount) {
            let error = new ExpressError("No industry with that code found", 404);
            return next(error);
        }
        const company  = await db.query(
            `SELECT * FROM companies 
            INNER JOIN companies_industries ON companies.code = companies_industries.comp_code
            WHERE companies_industries.ind_code = $1`, [req.params.code]);

        return res.json({industry: result.rows,
                        companies: company.rows})
    }
    catch(error){
        return next(error);
    }
})

/**POST /industries : add new industry to database */
router.post("/", async function(req,res,next){
    try{
        //load query rows into array to be submitted to the database
        let vals = [req.body.code, req.body.industry];
        const result = await db.query(
            `INSERT INTO industries (code, industry)
            VALUES ($1, $2)
            RETURNING  *`,
            vals);
        return res.json({industry: result.rows})
    }
    catch(error){
        return next(error);
    }
})

module.exports = router;