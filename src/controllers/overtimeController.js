const overtimeService = require("../services/overtimeService");

class OvertimeController {
  findAllById = async (req, res, next) => {
    try {
      const { id } = req.body;
      const data = await overtimeService.getAllOvertimesById(id);

      return res.success("Overtime retrieved successfully", data);
    } catch (error) {
      next(error);
    }
  };

  createOvertime = async (req, res, next) => {
    try {
      const data = await overtimeService.createOvertime(req.body);

      return res.success("Overtime created successfully", data);
    } catch (error) {
      next(error);
    }
  };

  updateOvertime = async (req, res, next) => {
    try {
      const overtimeId = Number(req.params.id);
      const employeeId = Number(req.body.employeeId);

      const data = await overtimeService.updateOvertime(
        overtimeId,
        employeeId,
        req.body,
      );

      return res.success("Overtime updated successfully", data);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      const overtimeId = Number(req.params.id);
      const employeeId = Number(req.body.employeeId);

      const data = await overtimeService.deleteOvertime(overtimeId, employeeId);

      return res.success("Overtime deleted successfully", data);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new OvertimeController();
