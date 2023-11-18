package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/KawaiKenta/todo-with-chat/config"
	"github.com/KawaiKenta/todo-with-chat/middleware"

	"golang.org/x/sync/errgroup"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load config!: %v", err)
	}

	if err := run(context.Background(), cfg); err != nil {
		log.Printf("failed to terminate server: %v", err)
	}
}

func run(ctx context.Context, cfg *config.Config) error {
	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	mux, cleanup, err := NewMux(ctx, cfg)
	if err != nil {
		return err
	}
	defer cleanup()

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
