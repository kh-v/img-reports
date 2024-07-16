const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/updateReportsController');


router.route('/commission')
    .get(teamController.updateCommissionReports);

router.route('/team')
    .get(teamController.updateTeamReports);

router.route('/production')
    .get(teamController.updateProductionReports);
    
module.exports = router;