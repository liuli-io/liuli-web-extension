import type { Manifest } from 'webextension-polyfill-ts'
import pkg from '../package.json'
import { IS_DEV, PORT } from '../scripts/utils'

export async function getManifest(): Promise<Manifest.WebExtensionManifest> {
  // update this file to update this manifest.json
  // can also be conditional based on your need
  return {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: './assets/logo.png',
      default_popup: './popup/index.html',
      default_title: 'LiuLi专用插件',
    },
    options_ui: {
      page: './options/index.html',
      open_in_tab: true,
    },
    background: {
      service_worker: 'background.js',
    },
    content_scripts: [
      {
        matches: ['http://*/*', 'https://*/*'],
        js: ['./content/index.global.js'],
      },
    ],
    icons: {
      16: './assets/logo.png',
      48: './assets/logo.png',
      128: './assets/logo.png',
    },
    permissions: ['tabs', 'storage', 'activeTab', 'notifications'],
    // this is required on dev for Vite script to load
    content_security_policy: {
      extension_pages: IS_DEV
        ? `script-src 'self' http://localhost:${PORT}; object-src 'self';`
        : undefined,
    },
  }
}
