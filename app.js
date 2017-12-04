const sgit = require ('simple-git/promise');
const path = require('path');
const pm = require('promisemaker')
// promisify the whole exec lib and then require the exec part of it
const exec = pm(require('child_process')).exec;

const basePath  = '/var/www';
const repos = require('./repos-and-branches.json');

// Checkout a branch and make a pull for that branch
async function pull(repoDir, branch, runCmds) {
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
    let changed = status.files && status.files.length != 0;
    if (changed) {
        console.log('pull-success', repoDir, branch, status);
    }
    if (err) {
        console.log('pull-error: ', repoDir, branch, err);
    }
    if(changed && runCmds) {
        runCmds.forEach((command) => {
            let err,result = await exec(command, {cwd: repoPath})
                .catch((e) => err = e);
                if (result) {
                    console.log('Running ', command, '\n', result);
                }
                if (err) {
                    console.log('Error running ', command, '\n', err);
                }
        });
    }
}
// Every 10 seconds loop through our repos and
// pull the latest commits
setInterval(() => {
    repo.forEach((repo) => {
        pull(path.join(basePath, repo.path), repo.branch, repo.runCmds)
    });
}, 10000);

pull('/Users/victorglimskog/web/petregister','dev');
