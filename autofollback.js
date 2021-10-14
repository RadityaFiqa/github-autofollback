var CronJob = require('cron').CronJob;
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({ auth: `token_github` });

(async () => {
  let lastFollowers = [];

  const job = new CronJob("0 * * * *", function () {
    const getFollowers = await octokit.request("GET /user/followers");
    const followers = getFollowers.data;

    if (JSON.stringify(followers) != JSON.stringify(lastFollowers)) {
      let newFollowers = followers.filter(
        (val) => !lastFollowers.includes(val)
      );
      console.log(newFollowers);

      newFollowers.map(async (data) => {
        const follow = await octokit.request(
          `PUT /user/following/${data.login}`,
          {
            username: data.login,
          }
        );
      });

      lastFollowers = followers;
    }
  });
  job.start();
})();

