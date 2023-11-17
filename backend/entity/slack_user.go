package entity

type SlackUser struct {
	UserID  int    `json:"user_id" db:"user_id"`
	SlackID string `json:"slack_id" db:"slack_id"`
}
