package middleware

import (
	"log"
	"net/http"
)

func LoggerMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("request: %s %s", r.Method, r.URL.Path)
		h.ServeHTTP(w, r)
	})
}
