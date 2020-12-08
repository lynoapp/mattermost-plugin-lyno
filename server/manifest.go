// This file is automatically generated. Do not modify it manually.

package main

import (
	"strings"

	"github.com/mattermost/mattermost-server/v5/model"
)

var manifest *model.Manifest

const manifestStr = `
{
  "id": "io.lyno.plugin",
  "name": "Lyno",
  "description": "This plugin provides a direct integration of voice channels into Mattermost using lyno.io.",
  "homepage_url": "https://github.com/lynoapp/mattermost-plugin-lyno/blob/master/README.md",
  "support_url": "https://github.com/lynoapp/mattermost-plugin-lyno/issues",
  "release_notes_url": "https://github.com/lynoapp/mattermost-plugin-lyno/releases/tag/1.0.0",
  "icon_path": "assets/logo.svg",
  "version": "1.0.0",
  "min_server_version": "5.12.0",
  "server": {
    "executables": {
      "linux-amd64": "server/dist/plugin-linux-amd64",
      "darwin-amd64": "server/dist/plugin-darwin-amd64",
      "windows-amd64": "server/dist/plugin-windows-amd64.exe"
    },
    "executable": ""
  },
  "webapp": {
    "bundle_path": "webapp/dist/main.js"
  },
  "settings_schema": {
    "header": "",
    "footer": "",
    "settings": []
  }
}
`

func init() {
	manifest = model.ManifestFromJson(strings.NewReader(manifestStr))
}
