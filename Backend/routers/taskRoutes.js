const express = require("express");
const {protect,adminOnly}= require("../middlewares/authMiddleware");
 const router = express.Router();


router.get('/dashboard-data',protect,getDashboardData)
router.get('/user-dashboard-data',protect,getUserDashboardData)
router.get('/',protect,getTask) //get all task(user:assigned,admin:All)
router.get('/:id',protect,getTaskById) //get task by ID

router.post('/',protect,adminOnly,createTask); //create a task Admin only
router.put('/:id',protect,updateTask); //update task details

router.delete('/:id',protect,adminOnly,deleteTak)//Delete a Task (Admin only)
router.put('/:id/status',protect,updateTaskStatus)//Update task status
router.put('/:id/todo',protect,updateTaskChecklist)//update task checklist

module.export= router;

