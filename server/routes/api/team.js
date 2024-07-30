const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/teamController');

router.route('/get_team')
    .get(teamController.getTeam);

module.exports = router;