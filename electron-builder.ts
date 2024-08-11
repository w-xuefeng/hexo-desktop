export default {
  $schema:
    'https://raw.githubusercontent.com/electron-userland/electron-builder/master/packages/app-builder-lib/scheme.json',
  appId: 'space.tangyuan.app',
  asar: true,
  productName: 'Hexo Desktop',
  directories: {
    output: 'release/${version}'
  },
  files: ['dist', 'dist-electron'],
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
      }
    ],
    artifactName:
      '${productName}-Mac-${version}-${arch}-Installer.${ext}',
    icon: 'res/icons/ios/AppIcon.appiconset'
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    artifactName:
      '${productName}-Windows-${version}-${arch}-Setup.${ext}',
    icon: 'res/icons/win/Icon-App-512x512@1x.png'
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false
  },
  linux: {
    target: [
      {
        target: 'deb',
        arch: ['arm64']
      }
    ],
    artifactName:
      '${productName}-Linux-${version}-${arch}.${ext}',
    maintainer: 'w-xuefeng',
    icon: 'res/icons/win/Icon-App-512x512@1x.png'
  }
};
