const CronJob = require('cron').CronJob;
const {
  Octokit
} = require("@octokit/core");
const _ = require("lodash")

const octokit = new Octokit({
  auth: `token_github`
});

(async () => {
  let lastFollowers = [];

  const job = new CronJob("0 * * * *", async function () {
    const getFollowers = await octokit.request("GET /user/followers");
    const followers = getFollowers.data;

    if (!_.isEqual(followers, lastFollowers)) {
      let newFollowers = _.differenceBy(followers, lastFollowers, 'login')

      newFollowers.map(async (data) => {
        await octokit.request(
          `PUT /user/following/${data.login}`, {
            username: data.login,
          }
        );
      });

      lastFollowers = followers;
    }
  });
  job.start();
})();
