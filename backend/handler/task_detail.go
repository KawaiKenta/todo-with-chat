package handler

import (
	"net/http"
	"strconv"

	"github.com/KawaiKenta/todo-with-chat/repository"
	"github.com/go-chi/chi/v5"
)

type TaskDetail struct {
	Repo repository.TaskRepository
}

func (td *TaskDetail) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	sid := chi.URLParam(r, "id")
	// idをintに変換
	id, err := strconv.Atoi(sid)
	if err != nil {
		rsp := ErrResponse{
			Message: "Invalid Id",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusBadRequest)
		return
	}
	task, err := td.Repo.FindByID(id)
	if err != nil {
		rsp := ErrResponse{
			Message: "Task Not Found",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusNotFound)
		return
	}
	RespondJSON(ctx, w, task, http.StatusOK)
}
