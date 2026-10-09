
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.get('/', loanController.getAll);
router.get('/:id', loanController.getById);
router.post('/', loanController.create);
router.put('/:id', loanController.update);
router.delete('/:id', loanController.remove);

module.exports = router;