.PHONY: help build build-local up down logs ps test front-start front-exec front-install
.DEFAULT_GOAL := help

DOCKER_TAG := latest
## .envファイルを読み込む 読み込んだ変数は$(変数名)で参照できる
include .env

build: ## Build docker image to deploy
	docker build -t kawaken629/todo-with-chat:${DOCKER_TAG} \
		--target deploy ./

build-local: ## Build docker image to local development
	docker compose build --no-cache

up: ## Do docker compose up with hot reload
	docker compose up -d

down: ## Do docker compose down
	docker compose down

logs: ## Tail docker compose logs
	docker compose logs -f

ps: ## Check container status
	docker compose ps

dry-migrate: ## Try migration
	mysqldef -u $(MYSQL_USER) -p $(MYSQL_PASSWORD) -h 127.0.0.1 -P 3306 $(MYSQL_DATABASE) --dry-run < ./backend/_tools/mysql/schema.sql

migrate:  ## Execute migration
	mysqldef -u $(MYSQL_USER) -p $(MYSQL_PASSWORD) -h 127.0.0.1 -P 3306 $(MYSQL_DATABASE) < ./backend/_tools/mysql/schema.sql

front-start: ## Start react dev server
	docker compose exec -w /app/todo-react frontend npm start

front-exec: ## Enter the container shell
	docker compose exec frontend bash

front-install: ## Execute npm install
	docker compose exec -w /app/todo-react frontend npm install

help: ## Show options
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'