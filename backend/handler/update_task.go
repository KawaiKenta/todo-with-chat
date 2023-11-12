package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/KawaiKenta/todo-with-chat/entity"
	"github.com/KawaiKenta/todo-with-chat/repository"
	"github.com/go-playground/validator/v10"
)

type UpdateTask struct {
	Repo      repository.TaskRepository
	Validator *validator.Validate
}

func (ut *UpdateTask) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req struct {
		Id       int       `json:"id" validate:"required"`
		UserId   int       `json:"user_id" validate:"required"`
		Title    string    `json:"title" validate:"required"`
		Content  string    `json:"content" validate:"omitempty"`
		DueDate  time.Time `json:"due_date" validate:"omitempty"`
		Priority string    `json:"priority" validate:"omitempty"`
		Status   string    `json:"status" validate:"required"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		rsp := ErrResponse{
			Message: "Invalid Request",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusInternalServerError)
		return
	}

	if err := ut.Validator.Struct(req); err != nil {
		rsp := ErrResponse{
			Message: "Invalid Request",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusBadRequest)
		return
	}

	// priorityが空の場合は中をセット
	var p string
	if req.Priority == "" {
		p = "中"
	} else {
		p = req.Priority
	}

	task := entity.Task{
		ID:      req.Id,
		UserID:  req.UserId,
		Title:   req.Title,
		Content: req.Content,
		DueDate: sql.NullTime{
			Time:  req.DueDate,
			Valid: !req.DueDate.IsZero(),
		},
		Priority:  p,
		Status:    req.Status,
		UpdatedAt: time.Now(),
	}

	insertedTask, err := ut.Repo.Update(&task)
	if err != nil {
		rsp := ErrResponse{
			Message: "Internal Server Error",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusInternalServerError)
		return
	}
	RespondJSON(ctx, w, insertedTask, http.StatusOK)
}
