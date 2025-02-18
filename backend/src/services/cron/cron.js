const cron = require("cron");
const { updateDump } = require("../../core/otkMachine");

async function monthlyCronTick() {
  updateDump;
}

async function schedule() {
  const monthlyCronJob = new cron.CronJob("0 0 1 * *", monthlyCronTick);
  //const dailyCronJob = new cron.CronJob("0 9 * * 1-5", dailyCronTick);
  //const hourlyCronJob = new cron.CronJob("45 10-18 * * *", hourlyCronTick);
  monthlyCronJob.start();
  //dailyCronJob.start();
  //hourlyCronJob.start();
}

module.exports = { schedule };
