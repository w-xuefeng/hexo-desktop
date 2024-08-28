import { envExecutePath } from '../configs/main';

export function getPathShell() {
  return process.platform === 'win32'
    ? `@echo off
setlocal
set outputFile=${envExecutePath}
echo %PATH% > "%outputFile%"
endlocal
@echo off`
    : `#!/bin/bash

TARGET_FILE="${envExecutePath}"
USER_PATH=$PATH

echo "将 PATH 环境变量写入到 $TARGET_FILE"
echo $USER_PATH >"$TARGET_FILE"

if [ $? -eq 0 ]; then
  echo "成功将 PATH 环境变量写入到 $TARGET_FILE"
  osascript -e 'tell application "Terminal" to close first window' & exit
else
  echo "写入失败，请检查路径是否正确。"
  exit 1
fi
`;
}
