const overtimeRepository = require("../repositories/overtimeRepository");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/customError");

class OvertimeService {
  async getAllOvertimesFromUser(id, filters = {}) {
    const profile = await overtimeRepository.findEmployeeProfile(id);

    let startDate = null;
    let endDate = null;

    if (
      filters.fromMonth &&
      filters.fromYear &&
      filters.toMonth &&
      filters.toYear
    ) {
      startDate = new Date(
        Number(filters.fromYear),
        Number(filters.fromMonth) - 1,
        1,
      );

      endDate = new Date(Number(filters.toYear), Number(filters.toMonth), 0);
    }

    const overtimes = await overtimeRepository.findAllFromUser(
      id,
      startDate,
      endDate,
    );

    return {
      profile,
      overtimes,
    };
  }

  async getAllOvertimesFromManager(id, filters = {}) {
    const profile = await overtimeRepository.findEmployeeProfile(id);

    let startDate = null;
    let endDate = null;

    if (
      filters.fromMonth &&
      filters.fromYear &&
      filters.toMonth &&
      filters.toYear
    ) {
      startDate = new Date(
        Number(filters.fromYear),
        Number(filters.fromMonth) - 1,
        1,
      );

      endDate = new Date(Number(filters.toYear), Number(filters.toMonth), 0);
    }

    const overtimes = await overtimeRepository.findAllFromManager(
      startDate,
      endDate,
    );

    return {
      profile,
      overtimes,
    };
  }

  async getById(overtimeId, id) {
    const profile = await overtimeRepository.findEmployeeProfile(id);

    const overtime = await overtimeRepository.findById(overtimeId);
    return {
      profile,
      overtime,
    };
  }

  async createOvertime(data) {
    // if (!data) {
    //   throw new BadRequestError("Data wajib diisi");
    // }
    return await overtimeRepository.create(data);
  }

  async updateOvertime(overtimeId, employeeId, data) {
    const existing = await overtimeRepository.findById(overtimeId);

    if (existing.employeeId !== employeeId) {
      throw new ForbiddenError(
        "Anda tidak memiliki akses untuk mengubah overtime ini",
      );
    }

    if (existing.status !== "REQUEST") {
      throw new BadRequestError(
        `Overtime dengan status ${existing.status} tidak dapat diubah`,
      );
    }

    if (
      (data.startTime && !data.endTime) ||
      (!data.startTime && data.endTime)
    ) {
      throw new BadRequestError("startTime dan endTime harus diisi bersamaan");
    }

    const allowed = ["projectName", "overtimeDate", "startTime", "endTime"];

    const filtered = Object.fromEntries(
      allowed
        .filter((key) => data[key] !== undefined)
        .map((key) => [key, data[key]]),
    );

    if (Object.keys(filtered).length === 0) {
      throw new BadRequestError(
        `Overtime dengan status ${existing.status} tidak dapat diubah`,
      );
    }
    return overtimeRepository.update(overtimeId, filtered, existing);
  }

  async updateStatus(id, data, managerId) {
    const allowedStatus = ["APPROVED", "REJECTED", "PENDING"];

    if (!allowedStatus.includes(data.status)) {
      throw new BadRequestError("Status harus PENDING, APPROVED atau REJECTED");
    }

    return overtimeRepository.updateStatus(id, {
      status: data.status,
      notes: data.notes,
      approvedBy: managerId,
    });
  }

  async rejectedStatus(id, status, managerId) {
    return overtimeRepository.reject(id, {
      status: status,
      approvedBy: managerId,
    });
  }

  async deleteOvertime(overtimeId, employeeId) {
    const existing = await overtimeRepository.findById(overtimeId);

    if (existing.employeeId !== employeeId) {
      throw new ForbiddenError(
        "Anda tidak memiliki akses untuk mengubah overtime ini",
      );
    }

    if (existing.status !== "REQUEST") {
      throw new BadRequestError(
        `Overtime dengan status ${existing.status} tidak dapat diubah`,
      );
    }

    return overtimeRepository.delete(overtimeId);
  }
}

module.exports = new OvertimeService();
