package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/KawaiKenta/todo-with-chat/middleware"
	"golang.org/x/sync/errgroup"
)

func main() {
	if err := run(context.Background()); err != nil {
		log.Printf("failed to terminate server: %v", err)
	}
}

func run(ctx context.Context) error {
	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	// TODO: muxを分割する
	// http.ServeMux satisfy interface of http.Handler
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(5 * time.Second)
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

	eg, ctx := errgroup.WithContext(ctx)
	eg.Go(func() error {
		if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("failed to listen and serve: %v", err)
			return err
		}
		return nil
	})

	// Wait for interrupt signal to gracefully shutdown the server
	<-ctx.Done()
	log.Println("shutting down server...")
	if err := s.Shutdown(context.Background()); err != nil {
		return err
	}
	return eg.Wait()
}
