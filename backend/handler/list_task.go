package handler

import (
	"net/http"

	"github.com/KawaiKenta/todo-with-chat/repository"
)

type ListTask struct {
	Repo repository.TaskRepository
}

func (lt *ListTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	tasks, err := lt.Repo.FindAll()
	if err != nil {
		RespondJSON(ctx, w, err.Error(), http.StatusInternalServerError)
		return
	}
	RespondJSON(ctx, w, tasks, http.StatusOK)
}
