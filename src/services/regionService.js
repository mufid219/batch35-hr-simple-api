const regionRepository = require("../repositories/regionRepository");
const countryRepository = require("../repositories/countryRepository");
const { NotFoundError } = require("../utils/customError");
const { getConnection } = require("../utils/db");

class RegionService {
  async getAllRegions() {
    return await regionRepository.findAll();
  }

  async getRegionById(id) {
    const region = await regionRepository.findById(id);
    if (!region) {
      const error = new Error(`Region with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    return region;
  }

  async createRegion(regionName) {
    if (!regionName) {
      const error = new Error("Region wajib diisi");
      error.statusCode = 400;
      throw error;
    }
    if (regionName.length > 25) {
      const error = new Error("Region length name too long! Max 25 character");
      error.statusCode = 400;
      throw error;
    }

    return await regionRepository.create(regionName);
  }

  async updateRegion(id, data) {
    if (!data.regionName || data.regionName.trim() === "") {
      const error = new Error("Region tidak boleh kosong!");
      error.statusCode = 400;
      throw error;
    }

    const updatedRegion = await regionRepository.update(id, data.regionName);

    if (!updatedRegion) {
      const error = new Error(`Region dengan ID ${id} tidak ditemukan`);
      error.statusCode = 401;
      throw error;
    }
    return updatedRegion;
  }

  async deleteRegion(id) {
    const isDeleted = await regionRepository.delete(id);
    if (!isDeleted) {
      const error = new Error(`Region dengan ID ${id} tidak ditemukan`);
      error.statusCode = 401;
      throw error;
    }
    return true;
  }

  async getAllRegionsWithCountries() {
    const regions = await regionRepository.findAllWithCountries();

    // Validasi: Jika data kosong atau tidak ada region sama sekali
    if (!regions || regions.length === 0) {
      throw new NotFoundError("No regions or countries found in the database.");
    }

    return regions;
  }

  async addCountriesToRegion(regionId, countries) {
    // 1. Validasi Input Awal
    if (!regionId) {
      throw new BadRequestError("Region ID is required.");
    }
    if (!countries || !Array.isArray(countries) || countries.length === 0) {
      throw new BadRequestError("Countries must be a non-empty array.");
    }

    let conn;
    try {
      // 2. Create connection
      conn = await getConnection();

      // 3. Call repository untuk melakukan proses looping insert
      await countryRepository.insertBulk(conn, regionId, countries);

      // 4. Jika seluruh looping sukses tanpa error, COMMIT data ke Oracle DB
      await conn.commit();

      // return data respons API
      return { regionId, totalInserted: countries.length, countries };
    } catch (error) {
      // 5. Jika ada error (misal ID duplikat), rollback semuanya!
      if (conn) {
        console.error("Transaction failed. Rolling back changes...");
        await conn.rollback();
      }

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

module.exports = new RegionService();
