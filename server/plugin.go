package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"sync"

	"github.com/mattermost/mattermost-server/v5/plugin"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

func (p *Plugin) OnActivate() error {
	if p.API.GetConfig().ServiceSettings.SiteURL == nil {
		return errors.New("siteURL is not set. Please set a siteURL and restart the plugin")
	}

	return nil
}

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	session, _ := p.API.GetSession(c.SessionId)
	siteURL := p.API.GetConfig().ServiceSettings.SiteURL

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(map[string]interface{}{
		"sessionToken": session.Token,
	})

	w.Header().Set("Access-Control-Allow-Origin", *siteURL)
}

// See https://developers.mattermost.com/extend/plugins/server/reference/
