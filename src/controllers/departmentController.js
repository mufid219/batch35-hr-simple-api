const departmentService = require("../services/departmentService");

class DepartmentController {
  async findAll(req, res, next) {
    try {
      const data = await departmentService.getAllDepartment();

      return res.success("Fetch all data departments", data);
      /*  return res.status(200).json({
                success : true,
                message : 'Fetch all data departments',
                data : departments
            }) */
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await departmentService.getDepartmentById(id);

      return res.success("Departments retrieved successfully", data);

      /* return res.status(200).json({
                success: true,
                message: 'Department found.',
                data: department
        }); */
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { departmentName } = req.body;
      const data = await departmentService.createDepartment(departmentName);

      return res.success("Department created successfully", data);
      //   return res.status(201).json({
      //     success: true,
      //     message: "Department created.",
      //     data: data,
      //   });
    } catch (error) {
      next(error);
    }
  }

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await departmentService.updateDepartment(id, req.body);
      return res.success("Department updated successfully", data);
      //   return res.json({
      //     success: true,
      //     statusCode: 200,
      //     message: "Department updated",
      //     data: updatedData,
      //   });
    } catch (error) {
      next(error); // Lempar ke Global Error Handler Expres
    }
  };

  remove = async (req, res, next) => {
    try {
      const { id } = req.params;
      await departmentService.deleteDepartment(id);
      return res.success("Department deleted successfully", null);
      //   return res.json({
      //     success: true,
      //     statusCode: 200,
      //     message: "Department removed",
      //   });
    } catch (error) {
      next(error);
    }
  };

  getDepartmentWithCountries = async (req, res, next) => {
    try {
      const data = await departmentService.getAllDepartmentsWithEmployees();

      return res.success(
        "Department with employees retrieved successfully",
        data,
        200,
      );
    } catch (error) {
      next(error);
    }
  };

  createEmployees = async (req, res, next) => {
    try {
      const { departmentId, employees } = req.body;

      const data = await departmentService.addEmployeesToDepartment(
        departmentId,
        employees,
      );

      return res.success(
        "Employees successfully added to the department",
        data,
        200,
      );
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new DepartmentController();
