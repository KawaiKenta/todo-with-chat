package repository

import (
	"github.com/KawaiKenta/todo-with-chat/entity"
	"github.com/jmoiron/sqlx"
)

type UserRepository interface {
	FindByID(id int) (*entity.User, error)
}

type MysqlUserRepository struct {
	db *sqlx.DB
}

func NewMysqlUserRepository(db *sqlx.DB) *MysqlUserRepository {
	return &MysqlUserRepository{db: db}
}

func (repo *MysqlUserRepository) FindByID(id int) (*entity.User, error) {
	var user entity.User
	if err := repo.db.Get(&user, "SELECT * FROM users WHERE id = ?", id); err != nil {
		return nil, err
	}
	return &user, nil
}
