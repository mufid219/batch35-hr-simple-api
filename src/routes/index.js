const express = require("express");
const router = express.Router();

const departmentRoutes = require("./departmentRoute");
const countryRoutes = require("./countryRoute");
const regionRoutes = require("./regionRoute");

router.use("/departments", departmentRoutes);
router.use("/countries", countryRoutes);
router.use("/regions", regionRoutes);

module.exports = router;

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
