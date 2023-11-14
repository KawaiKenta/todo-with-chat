package main

import (
	"context"
	"log"
	"net/http"

	"github.com/KawaiKenta/todo-with-chat/config"
	"github.com/KawaiKenta/todo-with-chat/handler"
	"github.com/KawaiKenta/todo-with-chat/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
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

	taskRepo := repository.NewMysqlTaskRepository(db)
	lt := handler.ListTask{Repo: taskRepo}
	mux.Get("/task/all", lt.ServeHTTP)

	td := handler.TaskDetail{Repo: taskRepo}
	mux.Get("/task/{id}", td.ServeHTTP)

	dt := handler.DeleteTask{Repo: taskRepo}
	mux.Patch("/task/delete", dt.ServeHTTP)

	v := validator.New()
	ct := handler.CreateTask{Repo: taskRepo, Validator: v}
	mux.Post("/task/create", ct.ServeHTTP)

	ut := handler.UpdateTask{Repo: taskRepo, Validator: v}
	mux.Patch("/task/update", ut.ServeHTTP)

	utk := handler.UserTask{Repo: taskRepo}
	mux.Get("/task/user/{id}", utk.ServeHTTP)

	userRepo := repository.NewMysqlUserRepository(db)
	ui := handler.UserInfo{Repo: userRepo}
	mux.Get("/user/{id}", ui.ServeHTTP)
	return mux, close, nil
}
