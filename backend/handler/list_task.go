package handler

import (
	"net/http"

	"github.com/KawaiKenta/todo-with-chat/entity"
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

	// tasksが空の場合は空の配列を返す
	if len(*tasks) == 0 {
		tasks = &[]entity.Task{}
	}
	RespondJSON(ctx, w, tasks, http.StatusOK)
}
