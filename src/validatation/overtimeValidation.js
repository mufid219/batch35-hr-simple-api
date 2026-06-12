const { z } = require("zod");

const findAllSchema = z.object({
  id: z
    .number({
      required_error: "Employee ID is required",
      invalid_type_error: "Employee ID must be a number",
    })
    .positive("Employee ID must be a positive number."),
});

const createOvertimeSchema = z.object({
  employeeId: z
    .number({
      required_error: "Employee ID is required",
      invalid_type_error: "Employee ID must be a number",
    })
    .positive("Employee ID must be a positive number."),

  projectName: z
    .string({
      required_error: "Project Name is required.",
      invalid_type_error: "Project Name must be a string.",
    })
    .min(2, "Project name must be at least 2 characters long.")
    .max(200, "Project name is too long. Max 200 characters.")
    .trim(),

  overtimeDate: z
    .string({
      required_error: "Tanggal lembur wajib diisi.",
    })
    .date("Format tanggal harus berupa YYYY-MM-DD."),

  startTime: z
    .string({
      required_error: "Jam mulai wajib diisi.",
    })
    .time({ message: "Format jam mulai harus berupa HH:MM (24 jam)." }),

  endTime: z
    .string({
      required_error: "Jam selesai wajib diisi.",
    })
    .time({ message: "Format jam selesai harus berupa HH:MM (24 jam)." }),
});

const updateOvertimeSchema = z.object({
  // employeeId: z
  //   .number({
  //     required_error: "Employee ID is required",
  //     invalid_type_error: "Employee ID must be a number",
  //   })
  //   .positive("Employee ID must be a positive number."),

  projectName: z
    .string({
      required_error: "Project Name is required.",
      invalid_type_error: "Project Name must be a string.",
    })
    .min(2, "Project name must be at least 2 characters long.")
    .max(200, "Project name is too long. Max 200 characters.")
    .trim()
    .optional(),

  startTime: z
    .string({
      required_error: "Jam mulai wajib diisi.",
    })
    .time({ message: "Format jam mulai harus berupa HH:MM (24 jam)." })
    .optional(),

  endTime: z
    .string({
      required_error: "Jam selesai wajib diisi.",
    })
    .time({ message: "Format jam selesai harus berupa HH:MM (24 jam)." })
    .optional(),
});

module.exports = {
  findAllSchema,
  createOvertimeSchema,
  updateOvertimeSchema,
};
