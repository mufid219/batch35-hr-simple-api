const countryRepository = require("../repositories/countryRepository");

class CountryService {
  async getAllCountry() {
    return await countryRepository.findAll();
  }

  async getCountyById(id) {
    const country = await countryRepository.findById(id);
    if (!country) {
      const error = new Error(`Country with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }
    return country;
  }

  async createCountry(countryData) {
    if (!countryData.countryId || countryData.countryId.length !== 2) {
      const error = new Error(
        "Country ID harus diisi dan wajib 2 karakter (contoh: ID)",
      );
      error.statusCode = 400;
      throw error;
    }
    if (!countryData.countryName) {
      const error = new Error("Country wajib diisi");
      error.statusCode = 400;
      throw error;
    }
    if (countryData.countryName.length > 40) {
      const error = new Error("Country length name too long! Max 40 character");
      error.statusCode = 400;
      throw error;
    }
    if (!countryData.regionId) {
      const error = new Error("Region id wajib diisi");
      error.statusCode = 400;
      throw error;
    }

    return await countryRepository.create(countryData);
  }

  async updateCountry(id, countryData) {
    if (!countryData.countryName || countryData.countryName.trim() === "") {
      const error = new Error("Country name tidak boleh kosong!");
      error.statusCode = 400;
      throw error;
    }
    if (!countryData.regionId) {
      const error = new Error("Region tidak boleh kosong!");
      error.statusCode = 400;
      throw error;
    }

    const updatedCountry = await countryRepository.update(id, countryData);

    if (!updatedCountry) {
      const error = new Error(`Country dengan ID ${id} tidak ditemukan`);
      error.statusCode = 401;
      throw error;
    }

    return updatedCountry;
  }

  async deleteCountry(id) {
    const isDeleted = await countryRepository.delete(id.toUpperCase());
    if (!isDeleted) {
      const error = new Error(`Country dengan ID ${id} tidak ditemukan`);
      error.statusCode = 401;
      throw error;
    }
    return true;
  }
}

module.exports = new CountryService();
