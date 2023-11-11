package entity

import (
	"database/sql"
	"time"
)

// omit empty で空のフィールドを省略するか空文字列として出力するかを指定できる
type Task struct {
	ID             int            `json:"id" db:"id"`
	UserID         int            `json:"user_id" db:"user_id"`
	Title          string         `json:"title" db:"title"`
	Content        string         `json:"content" db:"content"`
	DueDate        sql.NullString `json:"due_date,omitempty" db:"due_date"`
	Priority       string         `json:"priority" db:"priority"`
	Status         string         `json:"status" db:"status"`
	CreatedAt      time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at" db:"updated_at"`
	LastModifiedBy string         `json:"last_modified_by" db:"last_modified_by"`
}

// StatusはENUM('未着手', '着手中', '完了', '削除済み')
const (
	NotStarted = "未着手"
	InProgress = "着手中"
	Done       = "完了"
	Deleted    = "削除済み"
)

// PriorityはENUM('低', '中', '高')
const (
	Low    = "低"
	Middle = "中"
	High   = "高"
)

const (
	Human = "user"
	AI    = "AI"
)
