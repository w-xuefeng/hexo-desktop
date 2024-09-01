import { envExecutePath } from '../configs/main';

export function getPathShell() {
  return process.platform === 'win32'
    ? `$path = [System.Environment]::GetEnvironmentVariable('PATH', 'Machine')
$outfile = "${envExecutePath}"
$path | Out-File -FilePath $outfile -Encoding utf8
`
    : `#!/bin/bash

TARGET_FILE="${envExecutePath}"
USER_PATH=$PATH
echo $USER_PATH >"$TARGET_FILE"
if [ $? -eq 0 ]; then
  osascript -e 'tell application "Terminal" to close first window' & exit
else
  exit 1
fi
`;
}
