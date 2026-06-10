const overtimeService = require("../services/overtimeService");

class OvertimeController {
  findAllFromUser = async (req, res, next) => {
    try {
      const { id } = req.body;
      const { fromMonth, fromYear, toMonth, toYear } = req.query;
      const data = await overtimeService.getAllOvertimesFromUser(id, {
        fromMonth,
        fromYear,
        toMonth,
        toYear,
      });

      return res.success("Overtime retrieved successfully", data);
    } catch (error) {
      next(error);
    }
  };

  findAllFromManager = async (req, res, next) => {
    try {
      const { id } = req.body;
      const { fromMonth, fromYear, toMonth, toYear } = req.query;
      const data = await overtimeService.getAllOvertimesFromManager(id, {
        fromMonth,
        fromYear,
        toMonth,
        toYear,
      });

      return res.success("Overtime retrived successfully", data);
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

  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;

      const { managerId } = req.body;

      const data = await overtimeService.updateStatus(
        Number(id),
        req.body,
        managerId,
      );

      return res.success("Overtime updated successfully", data);
    } catch (error) {
      next(error);
    }
  };

  rejectStatus = async (req, res, next) => {
    try {
      const { id } = req.params;

      const { managerId } = req.body;

      const status = "REJECTED";

      const data = await overtimeService.rejectedStatus(
        Number(id),
        status,
        managerId,
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
