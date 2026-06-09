const express = require("express");
const router = express.Router();

const departmentRoutes = require("./departmentRoute");
const countryRoutes = require("./countryRoute");
const regionRoutes = require("./regionRoute");
const overtimeRoutes = require("./overtimeRoute");

router.use("/departments", departmentRoutes);
router.use("/countries", countryRoutes);
router.use("/regions", regionRoutes);
router.use("/overtimes", overtimeRoutes);

module.exports = router;

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
