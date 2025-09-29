const { Router } = require('express');
const {
  ServiceTypeController,
} = require('../controllers/serviceType.controller');

const router = Router();

router.get('/', ServiceTypeController.getAll);
router.get('/:id', ServiceTypeController.getById);
router.post('/', ServiceTypeController.create);
router.put('/:id', ServiceTypeController.update);
router.delete('/:id', ServiceTypeController.delete);

module.exports = router;
