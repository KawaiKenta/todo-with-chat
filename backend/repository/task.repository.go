package repository

import "github.com/KawaiKenta/todo-with-chat/entity"

type TaskRepository interface {
	FindAll() ([]entity.Task, error)
	FindByID(id int) (*entity.Task, error)
	Create(task entity.Task) (*entity.Task, error)
	Update(task entity.Task) (*entity.Task, error)
	DeleteByID(id int) error
}
