import fs from 'fs';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';
const logPath = path.join(__dirname, '../../logs', environment);

const errorLogPath = path.join(logPath, 'error.log');
const warnLogPath = path.join(logPath, 'warn.log');
const infoLogPath = path.join(logPath, 'info.log');

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath, { recursive: true });
}

const writeLog = (filePath: string, message: string) => {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;

  fs.appendFile(filePath, logMessage, (err) => {
    if (err) {
      process.stderr.write(
        `Failed to write log to ${filePath}: ${err.message}\n`
      );
    }
  });
};

console.error = function (...args) {
  writeLog(errorLogPath, args.join(' '));
  process.stderr.write(`${args.join(' ')}\n`);
};

console.warn = function (...args) {
  writeLog(warnLogPath, args.join(' '));
  process.stderr.write(`${args.join(' ')}\n`);
};

console.log = function (...args) {
  if (environment === 'development') {
    writeLog(infoLogPath, args.join(' '));
  }
  process.stdout.write(`${args.join(' ')}\n`);
};
