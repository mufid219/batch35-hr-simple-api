class EmployeeRepository {
  async insertBulk(conn, departmentId, employees) {
    const query = `
            INSERT INTO employees 
                (employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, manager_id, department_id)
            VALUES (:employeeId, :firstName, :lastName, :email, :phoneNumber, :hireDate, :jobId, :salary, :managerId, :departmentId)
        `;

    for (const employee of employees) {
      await conn.execute(query, {
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        hireDate: new Date(employee.hireDate),
        jobId: employee.jobId,
        salary: employee.salary,
        managerId: employee.managerId,
        departmentId: departmentId,
      });
    }
  }
}

module.exports = new EmployeeRepository();
