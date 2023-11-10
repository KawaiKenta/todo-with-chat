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
	if err := http.ListenAndServe(":8080", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, world!"))
	})); err != nil {
		return err
	}
	return nil
}
