const { BadRequestError } = require("../utils/customError");
const { oracledb, getConnection } = require("../utils/db");
const calculateHours = require("../utils/totalHours");

class OvertimeRepository {
  async findAll(employeeId) {
    let conn;

    try {
      conn = await getConnection();
      console.log(`employeeId = ${employeeId}, typeof ${typeof employeeId}`);
      const sql = `
                    SELECT
                        e.employee_id AS "employeeId",
                        e.first_name AS "firstName",
                        e.last_name AS "lastName",
                        j.job_title AS "jobTitle",
                        o.overtime_id AS "overtimeId",
                        o.project_name AS "projectName",
                        o.overtime_date AS "overtimeDate",
                        o.start_time AS "startTime",
                        o.end_time AS "endTime",
                        o.total_hours AS "totalHours",
                        o.status AS "status",
                        approver.first_name || ' ' || approver.last_name AS "approvedBy"
                    FROM employees e
                    JOIN jobs j
                        ON j.job_id = e.job_id
                    LEFT JOIN overtimes o
                        ON o.employee_id = e.employee_id
                    LEFT JOIN employees approver
                        ON approver.employee_id = o.approved_by
                    WHERE e.employee_id = :employeeId
                `;
      const result = await conn.execute(sql, { employeeId });

      const rows = result.rows;
      /* console.log("rows");
      console.log(rows); */

      const employeeMap = new Map();

      rows.forEach((row) => {
        if (!employeeMap.has(row.employeeId)) {
          employeeMap.set(row.employeeId, {
            employee: {
              employeeId: row.employeeId,
              firstName: row.firstName,
              lastName: row.lastName,
              jobTitle: row.jobTitle,
            },
            overtimes: [],
          });
        }

        employeeMap.get(row.employeeId).overtimes.push({
          overtimeId: row.overtimeId,
          projectName: row.projectName,
          overtimeDate: row.overtimeDate,
          startTime: row.startTime,
          endTime: row.endTime,
          totalHours: row.totalHours,
          status: row.status,
          approvedBy: row.approvedBy,
        });
      });

      const finalResult = [...employeeMap.values()][0];

      /* console.log("finalResult");
      console.log(finalResult); */
      return finalResult;
    } catch (error) {
      console.error("Error in OvertimeRepository.findAll:", error.message);
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
