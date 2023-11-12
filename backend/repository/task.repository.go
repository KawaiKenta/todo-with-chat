package repository

import (
	"github.com/KawaiKenta/todo-with-chat/entity"
	"github.com/jmoiron/sqlx"
)

type TaskRepository interface {
	FindAll() (*[]entity.Task, error)
	FindUserIDAll(id int) (*[]entity.Task, error)
	FindByID(id int) (*entity.Task, error)
	Create(task *entity.Task) (*entity.Task, error)
	Update(task *entity.Task) (*entity.Task, error)
	DeleteByID(id int) error
}

type MysqlTaskRepository struct {
	db *sqlx.DB
}

func NewMysqlTaskRepository(db *sqlx.DB) *MysqlTaskRepository {
	return &MysqlTaskRepository{db: db}
}

func (repo *MysqlTaskRepository) FindAll() (*[]entity.Task, error) {
	var tasks []entity.Task
	if err := repo.db.Select(&tasks, "SELECT * FROM tasks"); err != nil {
		return nil, err
	}
	return &tasks, nil
}

func (repo *MysqlTaskRepository) FindByID(id int) (*entity.Task, error) {
	var task entity.Task
	if err := repo.db.Get(&task, "SELECT * FROM tasks WHERE id = ?", id); err != nil {
		return nil, err
	}
	return &task, nil
}

func (repo *MysqlTaskRepository) Create(task *entity.Task) (*entity.Task, error) {
	r, err := repo.db.Exec(
		"INSERT INTO tasks (user_id, title, content, due_date, priority, status, last_modified_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
		task.UserID, task.Title, task.Content,
		task.DueDate, task.Priority, task.Status, task.LastModifiedBy,
	)
	if err != nil {
		return nil, err
	}
	// 挿入されたidをセット
	// 悩ましいポイント、insertされたCreatedAt, UpdatedAtをセットする必要があるが、
	// 二回クエリを投げるぐらいなら、タスクのデータをそのまま使う
	id, err := r.LastInsertId()
	if err != nil {
		return nil, err
	}
	task.ID = int(id)
	return task, nil
}

func (repo *MysqlTaskRepository) Update(task *entity.Task) (*entity.Task, error) {
	if _, err := repo.db.Exec(`UPDATE tasks SET title = ?, content = ?, due_date = ?,
		priority = ?, status = ? WHERE id = ?`,
		task.Title, task.Content, task.DueDate, task.Priority, task.Status, task.ID); err != nil {
		return nil, err
	}
	return task, nil
}

func (repo *MysqlTaskRepository) DeleteByID(id int) error {
	if _, err := repo.db.Exec("UPDATE tasks SET status = ? WHERE id = ?", entity.Deleted, id); err != nil {
		return err
	}
	return nil
}

func (repo *MysqlTaskRepository) FindUserIDAll(id int) (*[]entity.Task, error) {
	var tasks []entity.Task
	if err := repo.db.Select(&tasks, "SELECT * FROM tasks WHERE user_id = ?", id); err != nil {
		return nil, err
	}
	return &tasks, nil
}
