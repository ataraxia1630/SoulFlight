const { Router } = require('express');
const {
  ServiceTagController,
} = require('../controllers/serviceTag.controller');

const router = Router();

router.get('/', ServiceTagController.getAll);
router.get('/:id', ServiceTagController.getById);
router.post('/', ServiceTagController.create);
router.put('/:id', ServiceTagController.update);
router.delete('/:id', ServiceTagController.delete);

module.exports = router;
