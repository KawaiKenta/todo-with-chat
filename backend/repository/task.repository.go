package repository

import (
	"github.com/KawaiKenta/todo-with-chat/entity"
	"github.com/jmoiron/sqlx"
)

type TaskRepository interface {
	FindAll() ([]entity.Task, error)
	FindByID(id int) (*entity.Task, error)
	Create(task entity.Task) (*entity.Task, error)
	Update(task entity.Task) (*entity.Task, error)
	DeleteByID(id int) error
}

type MysqlTaskRepository struct {
	db *sqlx.DB
}

func NewMysqlTaskRepository(db *sqlx.DB) *MysqlTaskRepository {
	return &MysqlTaskRepository{db: db}
}

func (repo *MysqlTaskRepository) FindAll() ([]entity.Task, error) {
	var tasks []entity.Task
	if err := repo.db.Select(&tasks, "SELECT * FROM tasks"); err != nil {
		return nil, err
	}
	return tasks, nil
}

func (repo *MysqlTaskRepository) FindByID(id int) (*entity.Task, error) {
	var task entity.Task
	if err := repo.db.Get(&task, "SELECT * FROM tasks WHERE id = ?", id); err != nil {
		return nil, err
	}
	return &task, nil
}

func (repo *MysqlTaskRepository) Create(task entity.Task) (*entity.Task, error) {
	if _, err := repo.db.Exec("INSERT INTO tasks (user_id, title, content) VALUES (?, ?, ?)",
		task.UserID, task.Title, task.Content); err != nil {
		return nil, err
	}
	return &task, nil
}

func (repo *MysqlTaskRepository) Update(task entity.Task) (*entity.Task, error) {
	if _, err := repo.db.Exec("UPDATE tasks SET title = ?, content = ? WHERE id = ?",
		task.Title, task.Content, task.ID); err != nil {
		return nil, err
	}
	return &task, nil
}

func (repo *MysqlTaskRepository) DeleteByID(id int) error {
	if _, err := repo.db.Exec("DELETE FROM tasks WHERE id = ?", id); err != nil {
		return err
	}
	return nil
}
