const { ServiceTagService } = require('../services/serviceTag.service');

const ServiceTagController = {
  getAll: async (req, res) => {
    try {
      const serviceTags = await ServiceTagService.getAll();
      res.status(200).json(serviceTags);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const serviceTag = await ServiceTagService.getById(id);
      if (!serviceTag) {
        return res.status(404).json({ error: 'Service Tag not found' });
      }
      res.status(200).json(serviceTag);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  create: async (req, res) => {
    const data = req.body;
    try {
      const newServiceTag = await ServiceTagService.create(data);
      res.status(201).json(newServiceTag);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedServiceTag = await ServiceTagService.update(id, data);
      res.status(200).json(updatedServiceTag);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await ServiceTagService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};
module.exports = { ServiceTagController };
