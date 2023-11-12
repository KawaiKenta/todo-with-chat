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
		rsp := ErrResponse{
			Message: "Internal Server Error",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusInternalServerError)
		return
	}
	RespondJSON(ctx, w, tasks, http.StatusOK)
}
