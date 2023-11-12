package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/KawaiKenta/todo-with-chat/config"
	"github.com/KawaiKenta/todo-with-chat/entity"
	"github.com/KawaiKenta/todo-with-chat/helper"
	"github.com/KawaiKenta/todo-with-chat/repository"
	"github.com/go-chi/chi/v5"
)

func NewMux(ctx context.Context, cfg *config.Config) (http.Handler, func(), error) {
	// TODO:　本番環境だとsleepしてdbが立ち上がるまで待つ必要があるかも...
	db, close, err := repository.New(context.Background(), cfg)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
		return nil, close, err
	}

	mux := chi.NewRouter()

	mux.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		res := struct {
			Status string `json:"status"`
		}{
			Status: "ok",
		}
		helper.RespondJSON(ctx, w, res, http.StatusOK)
	})

	mux.Get("/hello", func(w http.ResponseWriter, r *http.Request) {
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

	mux.Get("/task", func(w http.ResponseWriter, r *http.Request) {
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

	return mux, close, nil
}
