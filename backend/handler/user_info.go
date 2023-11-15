package handler

import (
	"net/http"
	"strconv"

	"github.com/KawaiKenta/todo-with-chat/repository"
	"github.com/go-chi/chi/v5"
)

type UserInfo struct {
	Repo repository.UserRepository
}

func (ui *UserInfo) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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
	user, err := ui.Repo.FindByID(id)
	if err != nil {
		rsp := ErrResponse{
			Message: "Internal Server Error",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusInternalServerError)
		return
	}
	RespondJSON(ctx, w, user, http.StatusOK)
}
