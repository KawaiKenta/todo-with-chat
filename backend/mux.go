package main

import (
	"context"
	"log"
	"net/http"

	"github.com/KawaiKenta/todo-with-chat/config"
	"github.com/KawaiKenta/todo-with-chat/handler"
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

	hc := handler.HealthCheck{}
	mux.Get("/health", hc.ServeHTTP)

	repo := repository.NewMysqlTaskRepository(db)
	lt := handler.ListTask{Repo: repo}
	mux.Get("/tasks/all", lt.ServeHTTP)

	td := handler.TaskDetail{Repo: repo}
	mux.Get("/tasks/{id}", td.ServeHTTP)

	return mux, close, nil
}
