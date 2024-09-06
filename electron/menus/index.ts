import { GLStore } from '../../shared/global-manager/stores';
import { STORE_KEY } from '../../shared/dicts/enums';
import { app, Menu } from 'electron';

export default function buildAppMenu() {
  const isMac = process.platform === 'darwin';
  const template: any[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              {
                role: 'about',
                label: '关于'
              },
              { type: 'separator' },
              {
                role: 'services',
                label: '服务'
              },
              { type: 'separator' },
              {
                role: 'hide',
                label: '隐藏窗口'
              },
              {
                role: 'hideOthers',
                label: '隐藏其他'
              },
              {
                role: 'unhide',
                label: '显示窗口'
              },
              { type: 'separator' },
              {
                role: 'quit',
                label: '退出应用'
              }
            ]
          }
        ]
      : [
          {
            label: '关于',
            submenu: [
              // { type: 'separator' },
              {
                role: 'about',
                label: '关于'
              },
              {
                role: 'quit',
                label: '退出应用'
              }
            ]
          }
        ]),
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
              }
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }])
      ]
    },
    {
      label: '工具',
      submenu: [
        {
          label: '打开最近的文件',
          role: 'recentdocuments',
          submenu: [
            {
              label: '清除最近打开的...',
              role: 'clearrecentdocuments'
            }
          ]
        },
        {
          label: '清除缓存',
          click: () => {
            GLStore.delete(STORE_KEY.ENV_PATH);
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  return menu;
}
