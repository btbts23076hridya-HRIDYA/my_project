const express = require('express');
const router = express.Router();
const { createEntry, getEntries, getEntry, updateEntry, deleteEntry } = require('../controllers/journalController');
const { protect } = require('../middleware/auth');
const { journalRules, validate } = require('../middleware/validate');

router.use(protect);
router.post('/create', journalRules, validate, createEntry);
router.get('/', getEntries);
router.get('/:id', getEntry);
router.put('/update/:id', journalRules, validate, updateEntry);
router.delete('/delete/:id', deleteEntry);

module.exports = router;
