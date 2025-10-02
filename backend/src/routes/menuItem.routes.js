const { Router } = require('express');
const { MenuItemController } = require('../controllers/menuItem.controller');
const {
  createSchema,
  updateSchema,
} = require('../validators/menuItem.validator');
const validate = require('../middlewares/validate.middleware');

const router = Router();

router.get('/', MenuItemController.getAll);
router.get('/:id', MenuItemController.getById);
router.post('/', validate(createSchema), MenuItemController.create);
router.put('/:id', validate(updateSchema), MenuItemController.update);
router.delete('/:id', MenuItemController.delete);

module.exports = router;
