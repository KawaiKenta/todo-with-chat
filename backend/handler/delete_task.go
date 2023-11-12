package handler

import (
	"encoding/json"
	"net/http"

	"github.com/KawaiKenta/todo-with-chat/repository"
)

type DeleteTask struct {
	Repo repository.TaskRepository
}

func (dt *DeleteTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req struct {
		ID int `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		rsp := ErrResponse{
			Message: "Invalid Request",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusBadRequest)
		return
	}

	if err := dt.Repo.DeleteByID(req.ID); err != nil {
		rsp := ErrResponse{
			Message: "Task Not Found",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusNotFound)
		return
	}
	rsp := struct {
		Message string `json:"message"`
	}{
		Message: "success",
	}
	RespondJSON(ctx, w, rsp, http.StatusOK)
}
