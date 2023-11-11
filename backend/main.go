package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/KawaiKenta/todo-with-chat/config"
	"github.com/KawaiKenta/todo-with-chat/entity"
	"github.com/KawaiKenta/todo-with-chat/helper"
	"github.com/KawaiKenta/todo-with-chat/middleware"
	"github.com/KawaiKenta/todo-with-chat/repository"

	"golang.org/x/sync/errgroup"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}
	log.Printf("config: %+v", cfg)

	if err := run(context.Background(), cfg); err != nil {
		log.Printf("failed to terminate server: %v", err)
	}
}

func run(ctx context.Context, cfg *config.Config) error {
	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	// TODO:　本番環境だとsleepしてdbが立ち上がるまで待つ必要があるかも...
	db, close, err := repository.New(context.Background(), cfg)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	defer close()

	// TODO: muxを分割する
	// http.ServeMux satisfy interface of http.Handler
	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		res := struct {
			Status string `json:"status"`
		}{
			Status: "ok",
		}
		helper.RespondJSON(ctx, w, res, http.StatusOK)
	})
	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		// taskを取得する
		sql := "SELECT * FROM tasks"
		tasks := []entity.Task{}
		if err := db.SelectContext(ctx, &tasks, sql); err != nil {
			log.Printf("failed to select tasks: %v", err)
			helper.RespondJSON(ctx, w, err, http.StatusInternalServerError)
			return
		}
		// queからレスポンス
		helper.RespondJSON(ctx, w, tasks, http.StatusOK)
	})
	mux.HandleFunc("/task", func(w http.ResponseWriter, r *http.Request) {
		entity := entity.Task{
			ID:             1,
			UserID:         1,
			Title:          "タスクのタイトル",
			Content:        "タスクの内容",
			Priority:       entity.InProgress,
			Status:         entity.NotStarted,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
			LastModifiedBy: entity.AI,
		}
		helper.RespondJSON(ctx, w, entity, http.StatusOK)
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
