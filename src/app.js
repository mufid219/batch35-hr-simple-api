// 1. Core & Third-Party Modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// 2. Middlewares & Utilities
const { getConnection } = require("./utils/db");
const { globalErrorHandler } = require("./middlewares/errorMiddleware");
const { globalResponseHandler } = require("./utils/response");
const { validateBody } = require("./middlewares/validateMiddleware");
const {
  createDepartmentSchema,
} = require("./validatation/departmentValidation");
const {
  createRegionCountriesSchema,
} = require("./validatation/regionValidation");

// 3. Controllers, Routes & Configurations
const appConfig = require("./config/appConfig");
const dbConfig = require("./config/dbConfig");

const departmentController = require("./controllers/departmentController");
const regionController = require("./controllers/regionController");
const countryController = require("./controllers/countryController");

// call subrouter
const indexRouter = require("./routes/index");

const app = express();

const corsOptions = {
  // Masukkan daftar domain/URL frontend yang boleh mengakses API ini
  origin: [
    "http://localhost:5000", // Aplikasi flutter/react/vue
    "http://127.0.0.1:5500", // Live Server VS Code
    "https://hr-code.com", // Domain production
  ],
  methods: ["GET", "POST", "PUT", "DELETE"], // Method HTTP yang diizinkan
  allowedHeaders: ["Content-Type", "Authorization"], // Header yang diizinkan
  optionsSuccessStatus: 200, // Untuk kompatibilitas browser lama
};

app.use(cors(corsOptions));

// ----- Middleware Global Bawaan -----------------------
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Node akan mencari folder alamat path yg dipublish (public folder)
app.use(express.static(path.join(__dirname, "public")));

// ----------- API Routes & Injectors ----------------
// injection res.success & res.error sebelum routing
app.use(globalResponseHandler);

// call global router
app.use(appConfig.api.prefix, indexRouter);

// routing department
// app.get(
//   `${appConfig.api.prefix}/departments/employees`,
//   departmentController.getDepartmentWithCountries,
// );
// app.post(
//   `${appConfig.api.prefix}/departments/employees`,
//   departmentController.createEmployees,
// );

// app.get(`${appConfig.api.prefix}/departments`, departmentController.findAll);
// app.get(
//   `${appConfig.api.prefix}/departments/:id`,
//   departmentController.findById,
// );

// // contoh validasi using schemaDepartmentValidation, penggunaan middleware
// app.post(
//   `${appConfig.api.prefix}/departments`,
//   validateBody(createDepartmentSchema),
//   departmentController.create,
// );

// app.put(`${appConfig.api.prefix}/departments/:id`, departmentController.update);
// app.delete(
//   `${appConfig.api.prefix}/departments/:id`,
//   departmentController.remove,
// );

// routing region

// app.get(
//   `${appConfig.api.prefix}/regions/countries`,
//   regionController.getRegionsWithCountries,
// );
// // validation region
// app.post(
//   `${appConfig.api.prefix}/regions/countries`,
//   validateBody(createRegionCountriesSchema),
//   regionController.createCountries,
// );

// app.get(`${appConfig.api.prefix}/regions`, regionController.findAll);
// app.get(`${appConfig.api.prefix}/regions/:id`, regionController.findById);
// app.post(`${appConfig.api.prefix}/regions`, regionController.create);
// app.put(`${appConfig.api.prefix}/regions/:id`, regionController.update);
// app.delete(`${appConfig.api.prefix}/regions/:id`, regionController.remove);

// routing country
// app.get(`${appConfig.api.prefix}/countries`, countryController.findAll);
// app.get(`${appConfig.api.prefix}/countries/:id`, countryController.findById);
// app.post(`${appConfig.api.prefix}/countries`, countryController.create);
// app.put(`${appConfig.api.prefix}/countries/:id`, countryController.update);
// app.delete(`${appConfig.api.prefix}/countries/:id`, countryController.remove);

// inject paling bawah setelah routing: Global Error Handler dipanggil setelah semua rute gagal match
app.use(globalErrorHandler);

module.exports = app;
