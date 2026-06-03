const regionRepository = require("../repositories/regionRepository");

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
}

module.exports = new RegionService();
