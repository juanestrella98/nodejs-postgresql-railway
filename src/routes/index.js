const {Router} = require('express');
const router = Router();

const{getWorkouts, postWorkout, getWorkoutById, deleteWorkout, updateWorkout} = require("../controllers/index.controller");
const{getMebers, postmeber, getMeberById, deleteMember, updateMember} = require("../controllers/member.controller");
const { getRecords, getRecordsByWorkoutId, postRecord, deleteRecord, updateRecord } = require('../controllers/records.controller');

router.get('/', getWorkouts);

router.post('/workouts', postWorkout);

router.get('/workouts/:id', getWorkoutById);

router.delete('/workouts/:id', deleteWorkout);

router.patch('/workouts/:id', updateWorkout);

//controladores de la tabla socio
router.get('/members', getMebers);

router.get('/members/:id', getMeberById);

router.post('/members', postmeber );

router.delete('/members/:id', deleteMember);

router.patch('/members/:id', updateMember);

//controladores de la tabla records
router.get('/records', getRecords);

router.get('/workouts/:id/records', getRecordsByWorkoutId);

router.post('/records', postRecord);

router.delete('/records/:id', deleteRecord);

router.patch('/records/:id', updateRecord);
module.exports = router;