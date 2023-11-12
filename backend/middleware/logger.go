package middleware

import (
	"log"
	"net/http"
	"time"
)

func LoggerMiddleware(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 時間、リクエストメソッド、リクエストURLを出力
		t := time.Now()
		h.ServeHTTP(w, r)
		log.Printf(
			"%s\t%s\t%s",
			r.Method,
			r.RequestURI,
			time.Since(t),
		)
	})
}
