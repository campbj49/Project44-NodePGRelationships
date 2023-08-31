/** BizTime express application. */


const express = require("express");
const companyRoutes = require("./routes/companies");
const invoceRoutes = require("./routes/invoices");

const app = express();
const ExpressError = require("./expressError")

app.use(express.json());

//connections to the route files
app.use('/companies', companyRoutes);
app.use('/invoices', invoceRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
