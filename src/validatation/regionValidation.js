const { z } = require("zod");

//schema mirip dto yg punya validasi
const createRegionCountriesSchema = z.object({
  regionId: z
    .number({
      required_error: "Region ID is required.",
      invalid_type_error: "Region ID must be a number.",
    })
    .positive("Region ID must be a positive number."),

  countries: z
    .array(
      z.object({
        countryId: z
          .string()
          .length(
            2,
            "Country ID must be exactly 2 characters (e.g., 'ID', 'US').",
          )
          .toUpperCase(), // data akan diubah kapital
        countryName: z
          .string()
          .min(1, "Country name cannot be empty.")
          .max(50, "Country name is too long. Max 50 characters."),
      }),
    )
    .min(1, "At least one country must be provided in the array."),
});

const createOrUpdateRegionSchema = z.object({
  regionName: z
    .string({
      required_error: "Region name is required.",
      invalid_type_error: "Region name must be a string.",
    })
    .min(2, "Region name must be at least 2 characters long.")
    .max(30, "Region name is too long. Max 30 characters.")
    .trim(), // otomatis hapus spasi kosong di awal atau di akhir kalimat
});

module.exports = {
  createRegionCountriesSchema,
  createOrUpdateRegionSchema,
};
