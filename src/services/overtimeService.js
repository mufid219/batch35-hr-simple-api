const overtimeRepository = require("../repositories/overtimeRepository");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/customError");

class OvertimeService {
  async getAllOvertimesById(id) {
    const overtimes = await overtimeRepository.findAll(id);
    if (!overtimes) {
      throw new NotFoundError("No overtime found in the database");
    }
    return overtimes;
  }

  async createOvertime(data) {
    if (!data) {
      throw new BadRequestError("Data wajib diisi");
    }
    return await overtimeRepository.create(data);
  }

  async updateOvertime(overtimeId, employeeId, data) {
    const existing = await overtimeRepository.findById(overtimeId);

    if (existing.employeeId !== employeeId) {
      throw new ForbiddenError(
        "Anda tidak memiliki akses untuk mengubah overtime ini",
      );
    }

    if (existing.status !== "PENDING") {
      throw new BadRequestError(
        `Overtime dengan status ${existing.status} tidak dapat diubah`,
      );
    }

    const allowed = ["projectName", "overtimeDate", "startTime", "endTime"];
    const filtered = {};

    for (const key of allowed) {
      if (data[key] !== undefined) filtered[key] = data[key];
    }

    if (Object.keys(filtered).length === 0) {
      throw new BadRequestError(
        `Overtime dengan status ${existing.status} tidak dapat diubah`,
      );
    }
    return overtimeRepository.update(overtimeId, filtered);
  }

  async deleteOvertime(overtimeId, employeeId) {
    const existing = await overtimeRepository.findById(overtimeId);

    if (existing.employeeId !== employeeId) {
      throw new ForbiddenError(
        "Anda tidak memiliki akses untuk mengubah overtime ini",
      );
    }

    if (existing.status !== "PENDING") {
      throw new BadRequestError(
        `Overtime dengan status ${existing.status} tidak dapat diubah`,
      );
    }

    return overtimeRepository.delete(overtimeId);
  }
}

module.exports = new OvertimeService();
