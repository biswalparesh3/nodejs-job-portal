import express from 'express'
import userAuth from '../middlewares/authmiddleware.js';
import { createJobController, deleteJobController, getallJobsController, jobStatsController, updateJobController } from '../controller/jobscontroller.js';
const router = express.Router()
// route
// CREATE JOB
router.post('/create-job', userAuth, createJobController)
// GET JOB
router.get('/get-jobs', userAuth, getallJobsController)
// UPDATE JOB
router.patch('/update-job/:id', userAuth, updateJobController)
// DELETE JOB
router.delete('/delete-job/:id', userAuth, deleteJobController)
// JOB SEARCH
router.get('/job-stats', userAuth, jobStatsController)
export default router;