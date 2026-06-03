const countryService = require("../services/countryService");

class CountryController {
  async findAll(req, res, next) {
    try {
      const data = await countryService.getAllCountry();

      return res.success("Fetch all data countries", data);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await countryService.getCountyById(id);

      return res.success("Countries retrieved successfully", data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = await countryService.createCountry(req.body);

      return res.success("Countries created successfully", data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = await countryService.updateCountry(id, req.body);

      return res.success("Country updated successfully", data);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await countryService.deleteCountry(id);

      return res.success("Country deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CountryController();
