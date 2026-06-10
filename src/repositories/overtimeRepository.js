const { BadRequestError } = require("../utils/customError");
const { oracledb, getConnection } = require("../utils/db");
const calculateHours = require("../utils/totalHours");

class OvertimeRepository {
  async findEmployeeProfile(employeeId) {
    let conn;

    try {
      conn = await getConnection();
      const sql = `
        SELECT
            e.employee_id AS "employeeId",
            e.first_name AS "firstName",
            e.last_name AS "lastName",
            j.job_title AS "jobTitle"
        FROM employees e
        JOIN jobs j
            ON j.job_id = e.job_id
        WHERE e.employee_id = :employeeId
      `;
      const result = await conn.execute(sql, { employeeId });

      return result.rows;
    } catch (error) {
      console.error(
        "Error in OvertimeRepository.findEmployeeProfile:",
        error.message,
      );
    } finally {
      if (conn) await conn.close();
    }
  }

  async findAllFromUser(employeeId, startDate, endDate) {
    let conn;
    try {
      conn = await getConnection();
      let sql = `
      SELECT
        o.overtime_id AS "overtimeId",
        o.project_name AS "projectName",
        o.overtime_date AS "overtimeDate",
        o.start_time AS "startTime",
        o.end_time AS "endTime",
        o.total_hours AS "totalHours",
        o.status AS "status",
        approver.first_name || ' ' || approver.last_name AS "approvedBy",
        o.approved_at AS "approvedAt"
      FROM overtimes o
      LEFT JOIN employees approver
        ON approver.employee_id = o.approved_by
      WHERE o.employee_id = :employeeId
      
    `;

      const binds = {
        employeeId,
      };

      if (startDate && endDate) {
        sql += `
        AND o.overtime_date
        BETWEEN :startDate
        AND :endDate
      `;

        binds.startDate = startDate;
        binds.endDate = endDate;
      }

      sql += `
      ORDER BY o.overtime_date DESC
    `;

      const result = await conn.execute(sql, binds);
      return result.rows;
    } catch (error) {
      console.error(
        "Error in OvertimeRepository.findAllFromUser:",
        error.message,
      );
    } finally {
      if (conn) await conn.close();
    }
  }

  async findAllFromManager(startDate, endDate) {
    let conn;
    try {
      conn = await getConnection();
      let sql = `
      SELECT
          o.overtime_id AS "overtimeId",
          o.project_name AS "projectName",
          o.overtime_date AS "overtimeDate",
          o.start_time AS "startTime",
          o.end_time AS "endTime",
          o.total_hours AS "totalHours",
          o.status AS "status",

          e.employee_id AS "employeeId",
          e.first_name || ' ' || e.last_name AS "employeeName",

          approver.first_name || ' ' || approver.last_name AS "approvedBy"
      FROM overtimes o
      JOIN employees e
          ON e.employee_id = o.employee_id
      LEFT JOIN employees approver
          ON approver.employee_id = o.approved_by
      
    `;

      const binds = {};

      if (startDate && endDate) {
        sql += `
        WHERE o.overtime_date
        BETWEEN :startDate
        AND :endDate
      `;

        binds.startDate = startDate;
        binds.endDate = endDate;
      }

      sql += `
      ORDER BY o.overtime_date DESC
    `;

      const result = await conn.execute(sql, binds);

      return result.rows;
    } catch (error) {
      console.error(
        "Error in OvertimeRepository.findAllFromManager:",
        error.message,
      );
    } finally {
      if (conn) await conn.close();
    }
  }

  async create(data) {
    let conn;
    try {
      conn = await getConnection();
      const sql = `
        INSERT INTO overtimes (
            employee_id,
            project_name,
            overtime_date,
            start_time,
            end_time,
            total_hours
        )
        VALUES (
            :employeeId,
            :projectName,
            TO_DATE(:overtimeDate, 'YYYY-MM-DD'),
            :startTime,
            :endTime,
            :totalHours
        )
        RETURNING overtime_id 
        INTO :out_id  
      `;
      const totalHours = calculateHours(data.startTime, data.endTime);
      const result = await conn.execute(
        sql,
        {
          employeeId: data.employeeId,
          projectName: data.projectName,
          overtimeDate: data.overtimeDate,
          startTime: data.startTime,
          endTime: data.endTime,
          totalHours: totalHours,
          out_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        },
        { autoCommit: true },
      );
      console.log(result.outBinds);
      return {
        overtimeId: result.outBinds.out_id[0],
        projectName: data.projectName,
      };
    } catch (error) {
      console.error("Error in OvertimeRepository.create:", error.message);
    } finally {
      if (conn) await conn.close();
    }
  }

  async findById(id) {
    let conn;
    try {
      conn = await getConnection();
      const sql = `
        SELECT 
          overtime_id   AS "overtimeId",
          employee_id   AS "employeeId",
          start_time    AS "startTime",
          end_time      AS "endTime",
          status        AS "status"
        FROM overtimes
        WHERE overtime_id = :id 
      `;
      const result = await conn.execute(sql, { id });

      return result.rows[0] || null;
    } catch {
      console.error("Error in OvertimeRepository.findById:", error.message);
    } finally {
      if (conn) await conn.close();
    }
  }

  async update(id, data) {
    let conn;
    try {
      conn = await getConnection();

      const fieldMap = {
        projectName: "project_name = :projectName",
        overtimeDate: "overtime_date = TO_DATE(:overtimeDate, 'YYYY-MM-DD')",
        startTime: "start_time = :startTime",
        endTime: "end_time = :endTime",
        notes: "notes = :notes",
      };

      const setClauses = [];
      const binds = { id };

      for (const [key, clause] of Object.entries(fieldMap)) {
        if (data[key] !== undefined) {
          setClauses.push(clause);
          binds[key] = data[key];
        }
      }

      if (setClauses.length === 0) {
        throw new BadRequestError("Tidak ada field yang diupdate");
      }

      // Hitung ulang total_hours jika jam berubah
      if (data.startTime !== undefined || data.endTime !== undefined) {
        const existing = await this.findById(id);
        const startTime = data.startTime ?? existing.startTime;
        const endTime = data.endTime ?? existing.endTime;
        const totalHours = calculateHours(startTime, endTime);

        setClauses.push("total_hours = :totalHours");
        binds.totalHours = totalHours;
      }

      const sql = `
      UPDATE overtimes
      SET ${setClauses.join(",\n          ")}
      WHERE overtime_id = :id
    `;

      const result = await conn.execute(sql, binds, { autoCommit: true });

      if (result.rowsAffected === 0) {
        throw new BadRequestError(`Overtime dengan id ${id} tidak ditemukan`);
      }

      return { overtimeId: id, rowsAffected: result.rowsAffected };
    } catch {
      console.error("Error in OvertimeRepository.update:", error.message);
    } finally {
      if (conn) await conn.close();
    }
  }

  async updateStatus(id, data) {
    let conn;

    try {
      conn = await getConnection();

      const sql = `
        UPDATE overtimes
        SET
          status = :status,
          notes = :notes,
          approved_by = :approvedBy,
          approved_at = SYSDATE
        WHERE overtime_id = :id
      `;

      const binds = {
        id,
        status: data.status,
        notes: data.notes,
        approvedBy: data.approvedBy,
      };

      const result = await conn.execute(sql, binds, { autoCommit: true });
      console.log(`result = ${result}`);
      if (result.rowsAffected === 0) {
        throw new BadRequestError(`Overtime dengan id ${id} tidak ditemukan`);
      }

      return {
        overtimeId: id,
        status: data.status,
        rowsAffected: result.rowsAffected,
      };
    } catch {
      console.error("Error in OvertimeRepository.updateStatus:", error.message);
    } finally {
      if (conn) await conn.close();
    }
  }

  async reject(id, data) {
    let conn;

    try {
      conn = await getConnection();

      const sql = `
        UPDATE overtimes
        SET
          status = :status,
          approved_by = :approvedBy,
          approved_at = SYSDATE
        WHERE overtime_id = :id
      `;

      const binds = {
        id,
        status: data.status,
        approvedBy: data.approvedBy,
      };

      const result = await conn.execute(sql, binds, { autoCommit: true });
      if (result.rowsAffected === 0) {
        throw new BadRequestError(`Overtime dengan id ${id} tidak ditemukan`);
      }

      return {
        overtimeId: id,
        status: data.status,
        rowsAffected: result.rowsAffected,
      };
    } catch {
      console.error("Error in OvertimeRepository.rejected:", error.message);
    } finally {
      if (conn) await conn.close();
    }
  }

  async delete(id) {
    let conn;
    try {
      conn = await getConnection();
      const sql = `
        DELETE FROM overtimes
        WHERE overtime_id = :id
      `;

      const result = await conn.execute(sql, { id }, { autoCommit: true });

      if (result.rowsAffected === 0) {
        throw new BadRequestError(`Overtime dengan id ${id} tidak ditemukan`);
      }

      return { overtimeId: id, rowsAffected: result.rowsAffected };
    } catch (error) {
      console.error("Error in OvertimeRepository.delete:", error.message);
    } finally {
      if (conn) await conn.close();
    }
  }
}

module.exports = new OvertimeRepository();
