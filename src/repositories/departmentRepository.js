const { oracledb, getConnection } = require("../utils/db");

class DepartmentRepository {
  async findAll() {
    let conn;
    try {
      conn = await getConnection();
      const result = await conn.execute(
        `SELECT department_id AS "departmentId", department_name AS "departmentName" FROM departments`,
      );
      return result.rows;
    } finally {
      if (conn) await conn.close();
    }
  }

  async findById(id) {
    let conn;
    try {
      conn = await getConnection();
      const result = await conn.execute(
        `SELECT department_id AS "departmentId", department_name AS "departmentName" FROM departments WHERE department_id = :id`,
        [id],
      );
      return result.rows[0] || null;
    } finally {
      if (conn) await conn.close();
    }
  }

  async create(departmentName) {
    let conn;
    try {
      conn = await getConnection();
      // Pastikan panggil autocommit untuk menyimpan data
      const result = await conn.execute(
        `INSERT INTO departments (department_name) VALUES
(:departmentName) RETURNING department_id INTO :id`,
        {
          departmentName: departmentName,
          id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        },
        { autoCommit: true },
      );
      return { departmentId: result.outBinds.id[0], departmentName };
    } finally {
      if (conn) await conn.close();
    }
  }

  async update(id, departmentName) {
    let conn;
    try {
      conn = await getConnection();
      const sql = `
        UPDATE departments 
        SET department_name = :departmentName 
        WHERE department_id = :id 
        RETURNING department_id, department_name INTO :out_id, :out_name
        `;
      const result = await conn.execute(
        sql,
        {
          departmentName: departmentName,
          id: id,
          out_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
          out_name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        },
        {
          autoCommit: true,
        },
      );

      // Jika tidak ada data yg terupdate satupun
      if (result.rowsAffected === 0) return null;
      // Ambil data dari bind out
      return {
        departmentId: result.outBinds.out_id[0],
        departmentName: result.outBinds.out_name[0],
      };
    } finally {
      if (conn) await conn.close();
    }
  }

  async delete(id) {
    let conn;
    try {
      conn = await getConnection();
      const sql = `DELETE FROM departments WHERE department_id = :id`;
      const result = await conn.execute(sql, { id }, { autoCommit: true });
      // Mengembalikan nilai true jika berhasil dihapus, false jika ID tidak ketemu
      return result.rowsAffected > 0;
    } finally {
      if (conn) await conn.close();
    }
  }

  async findAllWithEmployee() {
    let conn;
    try {
      conn = await getConnection();

      const query = `
        SELECT
            d.department_id,
            d.department_name,
            e.employee_id,
            e.first_name,
            e.last_name
        FROM departments d
        LEFT JOIN employees e
            ON d.department_id = e.department_id
        ORDER BY d.department_id
      `;

      const result = await conn.execute(query);
      const rows = result.rows;

      // console.log(rows[0]);
      // console.log(Array.isArray(rows[0]));

      const nestedData = rows.reduce((acc, row) => {
        let department = acc.find(
          (item) => item.departmentId === row.DEPARTMENT_ID,
        );

        if (!department) {
          department = {
            departmentId: row.DEPARTMENT_ID,
            departmentName: row.DEPARTMENT_NAME,
            employees: [],
          };
          acc.push(department);
        }

        if (row.EMPLOYEE_ID) {
          department.employees.push({
            employeeId: row.EMPLOYEE_ID,
            firstName: row.FIRST_NAME,
            lastName: row.LAST_NAME,
          });
        }
        return acc;
      }, []);

      return nestedData;
      //     const departmentMap = new Map();

      //     console.log(result.rows[0]);
      //     console.log(Array.isArray(result.rows[0]));

      //     for (const row of result.rows) {
      //       if (!departmentMap.has(row.DEPARTMENT_ID)) {
      //         departmentMap.set(row.DEPARTMENT_ID, {
      //           departmentId: row.DEPARTMENT_ID,
      //           departmentName: row.DEPARTMENT_NAME,
      //           employees: [],
      //         });
      //       }

      //       const department = departmentMap.get(row.DEPARTMENT_ID);

      //       if (row.EMPLOYEE_ID) {
      //         department.employees.push({
      //           employeeId: row.EMPLOYEE_ID,
      //           firstName: row.FIRST_NAME,
      //           lastName: row.LAST_NAME,
      //         });
      //       }
      //     }

      //     return [...departmentMap.values()];
    } catch (error) {
      console.error(
        "Error in DepartmentRepository.findAllWithEmployee:",
        error.message,
      );
    } finally {
      if (conn) await conn.close();
    }
  }
}

module.exports = new DepartmentRepository();
