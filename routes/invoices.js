const express = require("express");
const router = new express.Router();
const db = require('../db.js');
const ExpressError = require("../expressError.js");
const { database } = require("pg/lib/defaults.js");

/** GET /invoices: get list of invoices */
router.get("/", async function(req, res, next) {
    try{
        const results = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({invoices: results.rows})
    }
    catch(error){
        return next(error);
    }
});

/**GET /invoices/[id]: get specific invoice */
router.get("/:id", async function(req,res,next){
    try{
        const result = await db.query(
            `SELECT * FROM invoices 
            WHERE id = $1`, [req.params.id]);
        if(!result.rowCount) {
            let error = new ExpressError("No invoice with that id found", 404);
            return next(error);
        }
        const company  = await db.query(
            `SELECT * FROM companies 
            WHERE code = $1`, [result.rows[0].comp_code]);

        return res.json({invoice: result.rows,
                        company: company.rows})
    }
    catch(error){
        return next(error);
    }
})

/**POST /invoices : add new invoice to database */
router.post("/", async function(req,res,next){
    try{
        //load query rows into array to be submitted to the database
        let vals = [req.body.comp_code, req.body.amt];
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2)
            RETURNING  *`,
            vals);
        return res.json({invoice: result.rows})
    }
    catch(error){
        return next(error);
    }
})

/**PUT /invoices/[id]: update specific invoice */
router.put("/:id", async function(req,res,next){
    try{
        //get invoice being updated to check what it's current paid status is
        const invoice = await db.query(
            `SELECT * FROM invoices 
            WHERE id = $1`, [req.params.id]);
        if(!invoice.rowCount) {
            let error = new ExpressError("No invoice with that id found", 404);
            return next(error);
        }
        let paid_date;
        let today = new Date(Date.now());
        //Set the paid date according to the instructions of request
        if(req.body.paid === false) paid_date = null;
        else if (!invoice.rows[0].paid_date) paid_date = today.toISOString();
        else paid_date = invoice.rows[0].paid_date;

        //load query rows into array to be submitted to the database
        let vals = [req.body.amt, paid_date, req.params.id];
        const result = await db.query(
            `UPDATE invoices 
            SET amt = $1, paid_date = $2
            WHERE id = $3
            RETURNING *`, vals);
        return res.json({invoice: result.rows})
    }
    catch(error){
        return next(error);
    }
})

/**DELETE /invoices/[id]: delete specific invoice */
router.delete("/:id", async function(req,res,next){
    try{
        const result = await db.query(
            `DELETE FROM invoices 
            WHERE id = $1`, [req.params.id]);
        if(!result.rowCount) {
            let error = new ExpressError("No invoice with that id found", 404);
            return next(error);
        }
        return res.json({status:"Deleted"})
    }
    catch(error){
        return next(error);
    }
})

module.exports = router;