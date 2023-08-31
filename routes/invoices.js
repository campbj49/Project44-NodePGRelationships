const express = require("express");
const router = new express.Router();
const db = require('../db.js');
const ExpressError = require("../expressError.js")

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
        const company = await db

        return res.json({invoice: result.rows})
    }
    catch(error){
        return next(error);
    }
})

/**POST /invoices : add new invoice to database */
router.post("/", async function(req,res,next){
    try{
        //load query rows into array to be submitted to the database
        let vals = [req.body.id, req.body.name, req.body.description];
        const result = await db.query(
            `INSERT INTO invoices (id, name, description)
            VALUES ($1, $2, $3)
            RETURNING  id, name, description`,
            vals);
        if(!result.rowCount) {
            let error = new ExpressError("No invoice with that id found", 404);
            return next(error);
        }
        return res.json({invoice: result.rows})
    }
    catch(error){
        return next(error);
    }
})

/**PUT /invoices/[id]: update specific invoice */
router.put("/:id", async function(req,res,next){
    try{
        //load query rows into array to be submitted to the database
        let vals = [req.body.name, req.body.description, req.params.id];
        const result = await db.query(
            `UPDATE invoices 
            SET name = $1, description = $2
            WHERE id = $3
            RETURNING  id, name, description`, vals);
        if(!result.rowCount) {
            let error = new ExpressError("No invoice with that id found", 404);
            return next(error);
        }
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