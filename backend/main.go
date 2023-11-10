package main

import (
	"log"
	"net/http"

	"github.com/KawaiKenta/todo-with-chat/middleware"
)

func main() {
	if err := run(); err != nil {
		log.Printf("failed to terminate server: %v", err)
	}
}

func run() error {
	// TODO: muxを分割する
	// http.ServeMux satisfy interface of http.Handler
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		res := `{"status": "Ok"}`
		w.Write([]byte(res))
	})
	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		res := `{"message": "Hello, World!"}`
		w.Write([]byte(res))
	})

	s := &http.Server{
		Addr: ":8080",
		Handler: middleware.LoggerMiddleware(
			middleware.CorsMiddleware(
				mux,
			),
		),
	}
	return s.ListenAndServe()
}
