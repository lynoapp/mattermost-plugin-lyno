package main

import (
	"context"
	"encoding/json"
	"net/http"
	"sync"

	"github.com/mattermost/mattermost-server/v5/plugin"
	"github.com/shurcooL/graphql"
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

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.
func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	session, _ := p.API.GetSession(c.SessionId)
	siteURL := p.API.GetConfig().ServiceSettings.SiteURL
	teamID := r.URL.Query().Get("teamId")

	if teamID == "" {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"teamId": teamID,
			"error":  "The 'teamId' url parameter is missing.",
		})
		return
	}

	if siteURL == nil {
		SERVICE_SETTINGS_DEFAULT_SITE_URL := "http://localhost:8065"
		siteURL = &SERVICE_SETTINGS_DEFAULT_SITE_URL // TODO: use constant from package
	}

	client := graphql.NewClient("http://192.168.0.27:5000/graphql", nil) // TODO: use env var

	type (
		AuthType      string
		TrimmedString string
	)

	var mutation struct {
		Authenticate struct {
			Token graphql.String
		} `graphql:"authenticate(type: $type, code: $code, siteUrl: $siteUrl, teamId: $teamId)"`
	}
	variables := map[string]interface{}{
		"type":    AuthType("Mattermost"),
		"code":    TrimmedString(session.Token),
		"siteUrl": TrimmedString(*siteURL),
		"teamId":  TrimmedString(teamID),
	}

	err := client.Mutate(context.Background(), &mutation, variables)

	w.Header().Set("Content-Type", "application/json")

	if err == nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"teamId": teamID,
			"token":  mutation.Authenticate.Token,
		})
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"teamId": teamID,
			"error":  err,
		})
	}
}

// See https://developers.mattermost.com/extend/plugins/server/reference/
