const debug = require('debug')('mytasks controller');
const userDataMapper = require('../../datamappers/user');
const mytasksDataMapper = require('../../datamappers/mytasks');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {
  async findOneByPk(req, res) {
    debug('dans findOneByPk');
    // req.params.id is user.id
    // check if a user exist in dbb for this id, id in req.params.id
    const user = await userDataMapper.findOneByPk(req.params.id);
    // debug(user);
    if (!user) {
      debug('pas de user trouvé pour cet id');
      throw new ApiError('user not found', { statusCode: 404 });
    }
    if (!user.home_id) {
      debug('pas de home trouvé pour ce user id');
      throw new ApiError('pas de home trouvé pour ce user id', { statusCode: 404 });
    }
    let doneTasks = await mytasksDataMapper.findDoneTaskByUserId(user.id);
    if (!doneTasks) {
      doneTasks = [];
    }
    let homeTask = await mytasksDataMapper.findHomeTaskByHomeId(user.home_id);
    // debug('homeTask.home_task', homeTask.home_task);
    if (!homeTask) {
      homeTask = [];
      const obj = {
        home_tasks: homeTask,
        done_tasks: doneTasks,
      };
      return res.status(200).json(obj);
    }
    let attributedTask = await mytasksDataMapper.findAttributedTaskByUserId(user.id);
    const newTasks = [];
    // if 0 attributed to the user
    if (!attributedTask) {
      attributedTask = [];
      homeTask.home_task.forEach((taskH) => {
        const taskHome = taskH;
        // 0 in front will be interpreted as not attributed
        taskHome.attributedTaskId = 0;
        newTasks.push(taskHome);
      });
    } else {
      homeTask.home_task.forEach((taskH) => {
        const taskHome = taskH;
        const taskAttributed = attributedTask.attributed_task.find((e) => e.home_task_id === taskHome.id);
        if (taskAttributed) {
          taskHome.attributedTaskId = taskAttributed.id;
        } else {
          // 0 in front will be interpreted as not attributed
          taskHome.attributedTaskId = 0;
        }
        newTasks.push(taskHome);
      });
    }
    const obj = {
      home_tasks: newTasks,
      done_tasks: doneTasks,
    };
    return res.status(200).json(obj);
  },
};
