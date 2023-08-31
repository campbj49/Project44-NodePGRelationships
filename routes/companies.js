const express = require("express");
const router = new express.Router();
const db = require('../db.js');
const slugify = require('slugify')
const ExpressError = require("../expressError.js")

/** GET /companies: get list of companies */
router.get("/", async function(req, res, next) {
    try{
        const results = await db.query(`SELECT code, name FROM companies`);
        return res.json({companies: results.rows})
    }
    catch(error){
        return next(error);
    }
});

/**GET /companies/[code]: get specific company and its invoices*/
router.get("/:code", async function(req,res,next){
    try{
        const result = await db.query(
            `SELECT * FROM companies 
            WHERE code = $1`, [req.params.code]);
        if(!result.rowCount) {
            let error = new ExpressError("No company with that code found", 404);
            return next(error);
        }

        const invoices  = await db.query(
            `SELECT * FROM invoices 
            WHERE comp_code = $1`, [req.params.code]);
        return res.json({company: result.rows,
                        invoices: invoices.rows})
    }
    catch(error){
        return next(error);
    }
})

/**POST /companies : add new company to database */
router.post("/", async function(req,res,next){
    try{
        //load query rows into array to be submitted to the database
        let vals = [slugify(req.body.code), req.body.name, req.body.description];
        const result = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING  code, name, description`,
            vals);
        return res.json({company: result.rows})
    }
    catch(error){
        return next(error);
    }
})

/**PUT /companies/[code]: update specific company */
router.put("/:code", async function(req,res,next){
    try{
        //load query rows into array to be submitted to the database
        let vals = [req.body.name, req.body.description, req.params.code];
        const result = await db.query(
            `UPDATE companies 
            SET name = $1, description = $2
            WHERE code = $3
            RETURNING  code, name, description`, vals);
        if(!result.rowCount) {
            let error = new ExpressError("No company with that code found", 404);
            return next(error);
        }
        return res.json({company: result.rows})
    }
    catch(error){
        return next(error);
    }
})

/**DELETE /companies/[code]: delete specific company */
router.delete("/:code", async function(req,res,next){
    try{
        const result = await db.query(
            `DELETE FROM companies 
            WHERE code = $1`, [req.params.code]);
        if(!result.rowCount) {
            let error = new ExpressError("No company with that code found", 404);
            return next(error);
        }
        return res.json({status:"Deleted"})
    }
    catch(error){
        return next(error);
    }
})

module.exports = router;