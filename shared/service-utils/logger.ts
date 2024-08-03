import log from 'electron-log/main';
import path from 'path';
import { logDirectoryPath } from '../configs/main';

export type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

export interface ILogOptions {
  level: LogLevel;
  fileFormat: string;
  consoleFormat: string;
}

log.initialize();
/**
 * 设置单个日志文件最大为 10mb
 */
log.transports.file.maxSize = 10 * 1024 ** 2;

export const defaultLogOptions: ILogOptions = {
  level: 'info',
  fileFormat: '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}',
  consoleFormat: '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
};

export default function logger(info: any, options?: Partial<ILogOptions>) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthDay = date.getDate();
  const timeDate = [year, month, monthDay].join('-');
  const op = Object.assign({}, defaultLogOptions, options);
  log.transports.file.format = op.fileFormat!;
  log.transports.console.format = op.consoleFormat!;
  log.transports.file.resolvePathFn = () => path.join(logDirectoryPath, `main-${timeDate}.log`);
  const str =
    typeof info !== 'string'
      ? typeof info.toString === 'function'
        ? info.toString()
        : typeof info == 'object'
          ? JSON.stringify(info)
          : info
      : info;
  log[op.level](str);
}

logger.log = log;
