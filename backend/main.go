package main

import (
	"log"
	"net/http"
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
		// json形式で返す
		w.Header().Set("Content-Type", "application/json")
		res := `{"status": "Ok"}`
		w.Write([]byte(res))
	})
	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		res := `{"message": "Hello, World!"}`
		w.Write([]byte(res))
	})

	s := &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}
	return s.ListenAndServe()
}
