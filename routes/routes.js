const express = require('express')
const router = express.Router()
const {createSchedule,deleteSchedule,updateSchedule ,listSchedule,failedSchedule} = require('../controller/emailController.js')


router.route('/').post(createSchedule);
router.route('/delete/schedule').delete(deleteSchedule);
router.route('/update/schedule').put(updateSchedule);
router.route('/list/schedule').get(listSchedule);
router.route('/list/failed/schedule').get(failedSchedule);


module.exports = router;