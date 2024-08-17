import path from 'node:path';
import fs from 'node:fs';
import { filePath } from './common';

function logPath(script: string) {
  return filePath('logs', `script-${script}.log`);
}

export function logScript(script: string, info: string, level = 'info') {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthDay = date.getDate();
  const hours = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();
  const ms = date.getMilliseconds();
  const timePrefix = `[${year}-${`${month}`.padStart(2, '0')}-${`${monthDay}`.padStart(
    2,
    '0'
  )} ${hours}:${minute}:${seconds}.${ms}]`;
  const levelTag = `[${level}]`;
  const logStr = [timePrefix, levelTag, info].join(' ');
  const p = logPath(script);
  if (!fs.existsSync(p)) {
    const dir = p.split(path.sep);
    dir.pop();
    fs.mkdirSync(dir.join(path.sep), { recursive: true });
    fs.writeFileSync(p, '', 'utf-8');
  }
  fs.appendFileSync(p, logStr + '\n', 'utf-8');
  console.log(logStr);
}
