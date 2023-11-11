package entity

import "time"

// omit empty で空のフィールドを省略するか空文字列として出力するかを指定できる
type Task struct {
	ID             int       `json:"id"`
	UserID         int       `json:"user_id"`
	Title          string    `json:"title"`
	Content        string    `json:"content"`
	DueDate        string    `json:"due_date,omitempty"`
	Priority       string    `json:"priority"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	LastModifiedBy string    `json:"last_modified_by"`
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
