const { ServiceTypeService } = require('../services/serviceType.service');

const ServiceTypeController = {
  getAll: async (req, res) => {
    try {
      const serviceTypes = await ServiceTypeService.getAll();
      res.status(200).json(serviceTypes);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const serviceType = await ServiceTypeService.getById(id);
      if (!serviceType) {
        return res.status(404).json({ error: 'Service Type not found' });
      }
      res.status(200).json(serviceType);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  create: async (req, res) => {
    const data = req.body;
    try {
      const newServiceType = await ServiceTypeService.create(data);
      res.status(201).json(newServiceType);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedServiceType = await ServiceTypeService.update(id, data);
      res.status(200).json(updatedServiceType);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await ServiceTypeService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = { ServiceTypeController };
