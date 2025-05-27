const express = require('express');
const router = express.Router();
const { createRole, getRoles } = require('../controllers/roleController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/permissions');

router.post('/', auth, authorize('Roles', 'create'), createRole);
router.get('/', auth, authorize('Roles', 'read'), getRoles);

module.exports = router;
