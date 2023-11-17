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

type CreateTaskAI struct {
	SlackRepo repository.SlackRepository
	Repo      repository.TaskRepository
	Validator *validator.Validate
}

func (cta *CreateTaskAI) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req struct {
		SlackId        string    `json:"slack_id" validate:"required"`
		Title          string    `json:"title" validate:"required"`
		Content        string    `json:"content" validate:"omitempty"`
		DueDate        time.Time `json:"due_date" validate:"omitempty"`
		Priority       string    `json:"priority" validate:"omitempty"`
		LastModifiedBy string    `json:"last_modified_by" validate:"required"`
		Status         string    `json:"status" validate:"omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		rsp := ErrResponse{
			Message: "Invalid Request",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusInternalServerError)
		return
	}

	if err := cta.Validator.Struct(req); err != nil {
		rsp := ErrResponse{
			Message: "Invalid Request",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusBadRequest)
		return
	}

	// slack_idからuser_idを取得
	userInfo, err := cta.SlackRepo.FindbySlackID(req.SlackId)
	if err != nil {
		rsp := ErrResponse{
			Message: "Internal Server Error",
			Details: err.Error(),
		}
		RespondJSON(ctx, w, rsp, http.StatusInternalServerError)
		return
	}

	// priorityが空の場合は中をセット
	var p string
	if req.Priority == "" {
		p = "中"
	} else {
		p = req.Priority
	}
	var st string
	if req.Status == "" {
		st = "未着手"
	} else {
		st = req.Status
	}

	task := entity.Task{
		UserID:  userInfo.UserID,
		Title:   req.Title,
		Content: req.Content,
		DueDate: sql.NullTime{
			Time:  req.DueDate,
			Valid: !req.DueDate.IsZero(),
		},
		Priority:       p,
		Status:         st,
		LastModifiedBy: req.LastModifiedBy,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	insertedTask, err := cta.Repo.Create(&task)
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
