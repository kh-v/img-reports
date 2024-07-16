const express = require('express');
const router = express.Router();
const commissionController = require('../../controllers/commisionController');


router.route('/get_commissions')
    .get(commissionController.getCommissions);

router.route('/get_summary')
    .get(commissionController.getSummary);

router.route('/get_rate_summary')
    .get(commissionController.getRateSummary);
    
module.exports = router;