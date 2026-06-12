const { z } = require("zod");

const createCountrySchema = z.object({
  countryId: z
    .string({
      required_error: "Country Id is required.",
      invalid_type_error: "Country Id must be a string.",
    })
    .trim()
    .length(2, "Country Id must be 2 characters long.")
    .toUpperCase(),

  countryName: z
    .string({
      required_error: "Country Name is required.",
      invalid_type_error: "Country Name must be a string.",
    })
    .min(2, "Country name must be at least 2 characters long.")
    .max(40, "Country name is too long. Max 40 characters.")
    .trim(),

  regionId: z
    .number({
      required_error: "Region ID is required.",
      invalid_type_error: "Region ID must be a number.",
    })
    .positive("Region ID must be a positive number."),
});

const updateCountrySchema = z.object({
  countryName: z
    .string({
      required_error: "Country Name is required.",
      invalid_type_error: "Country Name must be a string.",
    })
    .min(2, "Country name must be at least 2 characters long.")
    .max(40, "Country name is too long. Max 40 characters.")
    .trim(),

  regionId: z
    .number({
      required_error: "Region ID is required.",
      invalid_type_error: "Region ID must be a number.",
    })
    .positive("Region ID must be a positive number."),
});

module.exports = {
  createCountrySchema,
  updateCountrySchema,
};
