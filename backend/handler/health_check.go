package handler

import "net/http"

type HealthCheck struct{}

func (hc *HealthCheck) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	res := struct {
		Status string `json:"status"`
	}{
		Status: "ok",
	}
	RespondJSON(ctx, w, res, http.StatusOK)
}
