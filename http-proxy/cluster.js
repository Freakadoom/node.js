const cluster = require('cluster'),
      os = require('os'),
      pid = process.pid;

if (cluster.isMaster) {
    const cpusCount = os.cpus().length;
    console.log(`CPUs: ${cpusCount}.\nMaster started. Pid: ${pid}.`);
    for (let i = 0; i<cpusCount-1; i++) {
        const worker = cluster.fork();
    }
    cluster.on('exit', (worker) => {
        console.log(`Worker died! Pid: ${worker.process.pid}`);
        cluster.fork();
    });
} else {
    require('./http-proxy.js');
}