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
  const fingerprints = getFingerprints(args.fingerprints);

  info(`checking for fingerprints: ${chalk.bold(fingerprints.join(', '))}\n`);

  info(`reading: ${chalk.bold(args.report)}`);
  const jsonReport = JSON.parse(fs.readFileSync(args.report));

  info(`analysing...`);
  const auditInfo = {};
  const auditItems = {};
  jsonReport.forEach(item => {
    fingerprints.forEach(fingerprint => {
      if (item.fingerprint.startsWith(fingerprint)) {
        auditItems[item.fingerprint] = 'ignore';

        if (auditInfo[fingerprint] === undefined) {
          auditInfo[fingerprint] = 1;
        } else {
          auditInfo[fingerprint]++;
        }
      }
    });
  });

  let text = 'Times found:\n';
  for (let fingerprint in auditInfo) {
    text += `  ${fingerprint}: ${auditInfo[fingerprint]}\n`;
  }

  info(text)

  let fullAudit = [];

  if (fs.existsSync(args.audit)) {
    info(`reading: ${chalk.bold(args.audit)}`);
    fullAudit = fs.readFileSync(args.audit);
  }

  if (fullAudit.length === 0) {
    fullAudit = {};
  } else {
    fullAudit = JSON.parse(fullAudit);
  }

  const concatenated = Object.assign(fullAudit, auditItems);

  info(`writing: ${chalk.bold(args.audit)}\n`);
  fs.writeFileSync(args.audit, JSON.stringify(concatenated, null, 2));

  success(`Added audit info for fingerprints: ${chalk.bold(Object.keys(auditInfo).join(', '))}`);
}

function checkArgs(args) {
  let success = true;

  if (!args.fingerprints) {
    error('at least one fingerprint is required (-f)');
    success = false;
  }

  if (!args.report) {
    error('a report file is required (-i)');
    success = false;
  }

  if (!args.audit) {
    error('an audit file is required to append to (-a)');
    success = false;
  }

  if (!fs.existsSync(args.report)) {
    error(`File not found: ${args.report}`);
    success = false;
  }

  let fingerprints = args.fingerprints;
  fingerprints = removeEmptyFingerprints(fingerprints);

  if (fingerprints.length === 0) {
    error('provide at least one fingerprint');
    success = false;
  }

  return success;
}

function getFingerprints(fingerprints) {
  let altered = removeEmptyFingerprints(fingerprints);
  altered = Array.isArray(altered) ? altered : altered.split(',');
  return altered.filter((item, i) => altered.indexOf(item) === i);
}

function removeEmptyFingerprints(fingerprints) {
  if (Array.isArray(fingerprints)) {
    return fingerprints.filter(fingerprint => fingerprint.trim().length > 0);
  } else {
    return fingerprints.trim();
  }
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
