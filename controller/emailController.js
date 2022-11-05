const errorHandler = require("../middleware/errorHandler.js");
const emailHelper = require("../utils/email-notification.js");
const cron = require("node-cron");
const Schedule = require("../model/Schedule");
const EventEmitter = require("events");
const event = new EventEmitter();
var taskMap = new Map();
var taskId = 1;

exports.createSchedule = errorHandler(async (req, res, next) => {
  const { seconds } = req.query;
  let scheduledAt = new Date(Date.now() + 1000 * seconds).toString();
  let from = "interview@bigapp.com";
  let to = "srpshubham321@gmail.com";
  let subject = "BigApp task assignment";
  let content = `Scheduling mail for task id : ${taskId} at ${scheduledAt}`;
  let scheduledBy = "Shubham";

  let task = cron.schedule(`*/${seconds} * * * * *`, async (req, res) => {
    await emailHelper({
      email: to,
      subject: subject,
      content,
    });
    setImmediate(() => {
      task.stop();
    });
    event.emit("Mail Schedule");
  });

  taskMap.set(`task_${taskId}`, task);

  const mailSchedule = {
    status: "Scheduled",
    from: from,
    to: to,
    subject: subject,
    content: content,
    scheduledBy: scheduledBy,
    scheduledAt: scheduledAt,
    taskId: `task_${taskId}`,
  };
  console.log(mailSchedule);
  await Schedule.create(mailSchedule);
  res.status(200).json({
    sucess: true,
    mesaage: "Email sent successfully",
  });
  console.log("Message scheduled");
  taskId++;
  event.on("Mail Schedule", () => {
    console.log("Scheduled mail sent succeccfully.");
  });
});

exports.deleteSchedule = errorHandler(async (req, res, next) => {
  let { taskId } = req.query;
  let task = taskMap.get(`task_${taskId}`);
  task.stop();
  await Schedule.deleteOne({ taskId: `task_${taskId}` });
  taskMap.delete(`task_${taskId}`)
  console.log("Scheduled mail deleted");
});

exports.updateSchedule = errorHandler(async (req, res, next) => {
  let { reqTaskId, newSchedule } = req.query;

   //fetching data from database
  const data = await Schedule.findOne({ taskId: `task_${reqTaskId}` });
 

  let scheduledAt = new Date(Date.now() + 1000 * newSchedule).toString();
  const mailSchedule = {
    status:'Scheduled',
    from: data.from,
    to: data.to,
    subject: data.subject,
    content: data.content,
    scheduledBy: data.scheduledBy,
    scheduledAt: data.scheduledAt,
    taskId:`task_${reqTaskId}`,
  };

  //deleting the record from data base for existing scheduled message
  await Schedule.deleteOne({ taskId:`task_${reqTaskId}` });

  let oldTask = taskMap.get(`task_${reqTaskId}`);

  oldTask.stop();
  console.log("Scheduled mail deleted");

  let newTask = cron.schedule(
    `*/${newSchedule} * * * * *`,
    async (req, res) => {
      await emailHelper({
        email: data.to,
        subject: data.subject,
        content,
      });
      setImmediate(() => {
        task.stop();
      });
      event.emit("Mail Schedule");
    }
  );
  taskMap.set(`task_${reqTaskId}`, newTask);

 

  await Schedule.create(mailSchedule);

  res.status(200).json({
    sucess: true,
    mesaage: "Email sent successfully",
  });
  console.log("Message scheduled");

  event.on("Mail Schedule", () => {
    console.log("Scheduled mail sent succeccfully.");
  });
});

exports.listSchedule = errorHandler(async (req, res, next) => {
  const schedule = await Schedule.find();
  res.status(200).json({
    sucess: true,
    schedules: schedule,
  });
});

exports.failedSchedule = errorHandler(async (req, res, next) => {
  const schedule = await Schedule.find({$or : [{status:"Failed"},{status:"Unsent"}]});
  res.status(200).json({
    sucess: true,
    schedules: schedule,
  });
});

