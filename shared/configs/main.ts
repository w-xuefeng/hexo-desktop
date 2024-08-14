import os from 'os';
import path from 'path';
import { PKG_CONFIG } from './app';

export const dataDirectoryPath = path.join(os.homedir(), PKG_CONFIG.name, 'data');
export const logDirectoryPath = path.join(os.homedir(), PKG_CONFIG.name, 'logs');
export const envExecutePath = path.join(os.homedir(), PKG_CONFIG.name, 'path');
