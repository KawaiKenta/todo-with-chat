package handler

import (
	"net/http"
	"strconv"

	"github.com/KawaiKenta/todo-with-chat/entity"
	"github.com/KawaiKenta/todo-with-chat/repository"
	"github.com/go-chi/chi/v5"
)

type UserTask struct {
	Repo repository.TaskRepository
}

func (ut *UserTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	sid := chi.URLParam(r, "id")
	id, err := strconv.Atoi(sid)
	if err != nil {
		rsp := ErrResponse{
			Message: "Invalid Id",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusBadRequest)
		return
	}

	tasks, err := ut.Repo.FindUserIDAll(id)
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
