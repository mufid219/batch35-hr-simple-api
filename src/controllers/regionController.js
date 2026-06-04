const regionService = require("../services/regionService");

class RegionController {
  async findAll(req, res, next) {
    try {
      const data = await regionService.getAllRegions();

      return res.success("Regions retrieved successfully", data);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await regionService.getRegionById(id);

      return res.success("Regions retrived successfully", data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { regionName } = req.body;
      const data = await regionService.createRegion(regionName);

      return res.success("Region created successfully", data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = await regionService.updateRegion(id, req.body);

      return res.success("Region updated successfully", data);
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await regionService.deleteRegion(id);
      return res.success("Region deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // kita gunakan arrow function untuk hindari reference 'this'
  getRegionsWithCountries = async (req, res, next) => {
    try {
      const data = await regionService.getAllRegionsWithCountries();

      //di sini response di inject dan override message nya
      return res.success(
        "Regions with countries retrieved successfully.",
        data,
        200,
      );
    } catch (error) {
      // jika error akan di forward ke globalErrorHandler
      next(error);
    }
  };
}

module.exports = new RegionController();
