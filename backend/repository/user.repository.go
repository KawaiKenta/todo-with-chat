package repository

import "github.com/KawaiKenta/todo-with-chat/entity"

type UserRepository interface {
	FindByID(id int) (*entity.User, error)
}
