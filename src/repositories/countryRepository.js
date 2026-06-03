const { oracledb, getConnection } = require("../utils/db");

class CountryRepository {
  async findAll() {
    let conn;
    try {
      conn = await getConnection();
      const result = await conn.execute(`
            SELECT 
                c.country_id AS "countryId",
                c.country_name AS "countryName",
                c.region_id AS "regionId",
                r.region_name AS "regionName"
            FROM countries c
            INNER JOIN regions r ON c.region_id = r.region_id
                `);
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
        `
        SELECT 
            c.country_id AS "countryId",
            c.country_name AS "countryName",
            c.region_id AS "regionId",
            r.region_name AS "regionName"
        FROM countries c
        INNER JOIN regions r ON c.region_id = r.region_id
        WHERE c.country_id = :id
        `,
        { id: id.toUpperCase() },
      );
      return result.rows[0] || null;
    } finally {
      if (conn) await conn.close();
    }
  }

  async create(countryData) {
    let conn;
    const { countryId, countryName, regionId } = countryData;
    try {
      conn = await getConnection();
      const result = await conn.execute(
        `
            INSERT INTO countries
            (country_id, country_name, region_id)
            VALUES (:countryId, :countryName, :regionId)
            RETURNING country_id
            INTO :id
            `,
        {
          countryId: countryId.toUpperCase(),
          countryName: countryName,
          regionId: regionId,
          id: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        },
        { autoCommit: true },
      );
      return { countryId: result.outBinds.id[0], countryName, regionId };
    } finally {
      if (conn) await conn.close();
    }
  }

  async update(id, countryData) {
    let conn;
    const { countryName, regionId } = countryData;

    try {
      conn = await getConnection();
      const sql = `
            UPDATE countries
            SET 
                country_name = :countryName,
                region_id = :regionId
            WHERE country_id = :id
            RETURNING country_id, country_name, region_id
            INTO
            :out_id, :out_name, :out_reg_id
        `;

      const result = await conn.execute(
        sql,
        {
          countryName: countryName,
          id: id.toUpperCase(),
          regionId: regionId,
          out_id: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
          out_name: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
          out_reg_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        },
        {
          autoCommit: true,
        },
      );
      // Jika tidak ada data yg terupdate satupun
      if (result.rowsAffected === 0) return null;
      // Ambil data dari bind out
      return {
        countryId: result.outBinds.out_id[0],
        departmentName: result.outBinds.out_name[0],
        regionId: result.outBinds.out_reg_id[0],
      };
    } finally {
      if (conn) await conn.close();
    }
  }

  async delete(id) {
    let conn;
    try {
      conn = await getConnection();
      const sql = `
            DELETE FROM countries
            WHERE country_id = :id
        `;
      const result = await conn.execute(
        sql,
        {
          id: id,
        },
        {
          autoCommit: true,
        },
      );
      return result.rowsAffected > 0;
    } finally {
      if (conn) await conn.close();
    }
  }
}

module.exports = new CountryRepository();
