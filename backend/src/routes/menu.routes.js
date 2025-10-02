const { Router } = require('express');
const { MenuController } = require('../controllers/menu.controller');
const { createSchema, updateSchema } = require('../validators/menu.validator');
const validate = require('../middlewares/validate.middleware');

const router = Router();

router.get('/', MenuController.getAll);
router.get('/:id', MenuController.getById);
router.post('/', validate(createSchema), MenuController.create);
router.put('/:id', validate(updateSchema), MenuController.update);
router.delete('/:id', MenuController.delete);

module.exports = router;
