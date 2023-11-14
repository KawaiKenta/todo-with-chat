package entity

import (
	"database/sql"
	"time"
)

type User struct {
	ID        int          `json:"id" db:"id"`
	Name      string       `json:"name" db:"name"`
	Email     string       `json:"email" db:"email"`
	CreatedAt time.Time    `json:"created_at" db:"created_at"`
	UpdatedAt time.Time    `json:"updated_at" db:"updated_at"`
	DeletedAt sql.NullTime `json:"deleted_at" db:"deleted_at"`
}
