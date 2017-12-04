const sgit = require ('simple-git/promise');
const path = require('path');

const basePath  = '/var/www';
const repos = require('./repos-and-branches.json');

// Checkout a branch and make a pull for that branch
async function pull(repoDir, branch) {
    let repo;
    let status;
    let err;
    try {
        repo = sgit(repoDir);
        await repo.checkout(branch);
        status = await repo.pull('origin', branch);
    } catch(e) {
        console.log('home made error handling');
        err = e;
    }
    if (status.files && status.files.length != 0) {
        console.log('pull-success', status);
    }
    if (err) {
        console.log('pull-error: ', err);
    }
}
// Every 10 seconds loop through our repos and
// pull the latest commits
setInterval(() => {
    for(let repo of repos) {
        pull(path.join(basePath, repo.path), repo.branch)
    }
}, 10000);

pull('/Users/victorglimskog/web/petregister','dev');
