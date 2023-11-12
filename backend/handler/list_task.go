package handler

import (
	"net/http"

	"github.com/KawaiKenta/todo-with-chat/repository"
)

type ListTask struct {
	repo repository.ITaskRepository
}

func (lt *ListTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	tasks, err := lt.repo.FindAll()
	if err != nil {
		RespondJSON(ctx, w, err.Error(), http.StatusInternalServerError)
		return
	}
	RespondJSON(ctx, w, tasks, http.StatusOK)
}
