const parseArgs = require('minimist');
const chalk = require('chalk');
const fs = require('fs');

const args = parseArgs(process.argv.slice(2), {
  string: [
    'i',
    'a',
    'f'
  ],
  alias: {
    report: 'i',
    audit: 'a',
    fingerprints: 'f'
  }
});

if (checkArgs(args)) {
  main(args);
}

function main(args) {

  checkArgs(args);

  const fingerprints = Array.isArray(args.fingerprints) ? args.fingerprints : [args.fingerprints];

  info(`checking for fingerprints: ${JSON.stringify(fingerprints)}`);

  info(`reading: ${args.report}`);
  const jsonReport = JSON.parse(fs.readFileSync(args.report));

  info(`analysing: ${args.report}`);
  const auditInfo = {};
  const auditItems = {};
  jsonReport.forEach(item => {
    fingerprints.forEach(fingerprint => {
      if (item.fingerprint.startsWith(fingerprint)) {
        auditItems[item.fingerprint] = "ignore";

        if (auditInfo[fingerprint] === undefined) {
          auditInfo[fingerprint] = 1;
        } else {
          auditInfo[fingerprint]++;
        }
      }
    });
  });

  info('Times found:');
  for (let fingerprint in auditInfo) {
    info(`\t${fingerprint}: ${auditInfo[fingerprint]}`);
  }

  info(`reading: ${args.audit}`);
  let fullAudit = fs.readFileSync(args.audit);

  if (fullAudit.length === 0) {
    fullAudit = {};
  } else {
    fullAudit = JSON.parse(fullAudit);
  }
  const concatenated = Object.assign(fullAudit, auditItems);

  info(`writing to: ${args.audit}`);
  fs.writeFileSync(args.audit, JSON.stringify(concatenated, null, 2));

  let sep = " ";
  let text = "Added audit info for";
  for (let fingerprint in auditInfo) {
    text = text + sep + fingerprint;
    sep = ", "
  }
  success(text)
}

function checkArgs(args) {
  let success = true;

  if (!args.fingerprints) {
    error(`at least one fingerprint is required (-f)`);
    success = false;
  }

  if (!args.report) {
    error(`a report file is required (-i)`);
    success = false;
  }

  if (!args.audit) {
    error(`an audit file is required to append to (-a)`)
    success = false;
  }

  return success;
}

function info(data) {
  console.log(chalk.white(data));
}

function error(data) {
  console.log(chalk.bold.red(data));
}

function success(data) {
  console.log(chalk.green(data));
}
