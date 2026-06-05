const departmentRepository = require("../repositories/departmentRepository");
const employeeRepository = require("../repositories/employeeRepository");
const { BadRequestError, NotFoundError } = require("../utils/customError");
const { getConnection } = require("../utils/db");

class DepartmentService {
  async getAllDepartment() {
    return await departmentRepository.findAll();
  }

  async getDepartmentById(id) {
    const department = await departmentRepository.findById(id);
    if (!department) {
      /* const error = new Error(`Department with ID ${id} not found.`);
            error.statusCode = 404;
            throw error; */
      throw new NotFoundError(`Department with ID ${id} not found.`);
    }
    return department;
  }

  async createDepartment(departmentName) {
    if (!departmentName) {
      /* const error = new Error('Nama department wajib diisi');
            error.statusCode = 400;
            throw error;  */

      throw new BadRequestError("Nama department wajib diisi");
    }
    if (departmentName.length > 50) {
      /* const error = new Error('Department length name too long! Max 50 character.');
            error.statusCode = 400;
            throw error; */
      throw new BadRequestError();
    }

    return await departmentRepository.create(departmentName);
  }

  async updateDepartment(id, data) {
    if (!data.departmentName || data.departmentName.trim() === "") {
      /* const error = new Error('Nama department tidak boleh kosong!');
            error.statusCode = 400;
            throw error; */
      throw new BadRequestError("Nama department tidak boleh kosong!");
    }

    const updatedDepartment = await departmentRepository.update(
      id,
      data.departmentName,
    );

    if (!updatedDepartment) {
      /* const error = new Error(`Department dengan ID ${id} tidak ditemukan`);
            error.statusCode = 401;
            throw error; */
      throw new NotFoundError();
    }
    return updatedDepartment;
  }

  async deleteDepartment(id) {
    const isDeleted = await departmentRepository.delete(id);
    if (!isDeleted) {
      /* const error = new Error(`Department dengan ID ${id} tidak ditemukan`);
            error.statusCode = 401;
            throw error; */

      throw new NotFoundError();
    }
    return true;
  }

  async getAllDepartmentsWithEmployees() {
    const departments = await departmentRepository.findAllWithEmployee();

    if (!departments || departments.length === 0) {
      throw new NotFoundError("No regions or countries found in the database");
    }

    return departments;
  }

  async addEmployeesToDepartment(departmentId, employees) {
    // 1. Validasi input awal
    if (!departmentId) {
      throw new BadRequestError("Department ID is required");
    }
    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      throw new BadRequestError("Employees must be a non-empty array.");
    }

    let conn;
    try {
      // 2. create connection
      conn = await getConnection();

      // 3. call repository untuk melakukan proses looping insert
      await employeeRepository.insertBulk(conn, departmentId, employees);

      // 4. jika seluruh looping sukses tanpa error, COMMIT data ke Oracle DB
      await conn.commit();

      // return data respons API
      return { departmentId, totalInserted: employees.length, employees };
    } catch (error) {
      // 5. jika ada error (misal ID duplikat), rollback semuanya
      console.error("Transaction failed. Rolling back changes...");
      await conn.rollback();

      // Jika ada error constraint dari oracle, kita bungkus dengna BadRequestError
      if (error.message.includes("ORA-00001")) {
        throw new BadRequestError(
          "One of the Country IDs already exists (Duplicate Primary Key).",
        );
      }

      throw error; // lempar ke global handler
    } finally {
      // 6. Pastikan koneksi selalu di clsoe
      if (conn) await conn.close();
    }
  }
}

module.exports = new DepartmentService();
