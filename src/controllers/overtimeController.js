const overtimeService = require("../services/overtimeService");

class OvertimeController {
  findAllFromUser = async (req, res, next) => {
    try {
      const { id } = req.query;
      const { fromMonth, fromYear, toMonth, toYear } = req.query;
      const data = await overtimeService.getAllOvertimesFromUser(Number(id), {
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
      const { id } = req.query;
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

  findById = async (req, res, next) => {
    try {
      const { id } = req.query;

      const overtimeId = req.params.id;

      const data = await overtimeService.getById(overtimeId, id);

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
      const { id } = req.query;

      const data = await overtimeService.updateOvertime(
        overtimeId,
        Number(id),
        req.body,
      );

      return res.success("Overtime updated successfully", data);
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const overtimeId = Number(req.params.id);

      const { id } = req.query;

      const data = await overtimeService.updateStatus(
        overtimeId,
        req.body,
        Number(id),
      );

      return res.success("Overtime updated successfully", data);
    } catch (error) {
      next(error);
    }
  };

  rejectStatus = async (req, res, next) => {
    try {
      const overtimeId = Number(req.params.id);

      const { id } = req.query;

      const status = "REJECTED";

      const data = await overtimeService.rejectedStatus(
        overtimeId,
        status,
        Number(id),
      );

      return res.success("Overtime updated successfully", data);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      const overtimeId = Number(req.params.id);
      const { id } = req.query;

      const data = await overtimeService.deleteOvertime(overtimeId, Number(id));

      return res.success("Overtime deleted successfully", data);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new OvertimeController();
