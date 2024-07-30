const express = require('express');
const router = express.Router();
const productionController = require('../../controllers/productionController');

router.route('/get_productions')
    .get(productionController.getProductions);

module.exports = router;