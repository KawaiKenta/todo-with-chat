package repository

import (
	"github.com/KawaiKenta/todo-with-chat/entity"
	"github.com/jmoiron/sqlx"
)

type SlackRepository interface {
	FindbySlackID(id string) (*entity.SlackUser, error)
}

type MysqlSlackRepository struct {
	db *sqlx.DB
}

func NewMysqlSlackRepository(db *sqlx.DB) *MysqlSlackRepository {
	return &MysqlSlackRepository{db: db}
}

func (repo *MysqlSlackRepository) FindbySlackID(id string) (*entity.SlackUser, error) {
	var slackUser entity.SlackUser
	if err := repo.db.Get(&slackUser, "SELECT * FROM slack_users WHERE slack_id = ?", id); err != nil {
		return nil, err
	}
	return &slackUser, nil
}
