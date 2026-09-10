include .env
export

COMPOSE = docker compose --env-file ./.env -f $(COMPOSE_FILE)

ifeq ($(USE_DATA_DIR),false)
	DATA_DIR := $(shell pwd)/cms-data
endif

all: up

up:
	mkdir -p \
		${DATA_DIR}/grafana \
		${DATA_DIR}/elasticsearch \
		${DATA_DIR}/prometheus \
		${DATA_DIR}/minio
	@chmod 644 ./secrets/*
	@chmod 600 ./secrets/elasticsearch_password.txt 2>/dev/null || true
	DATA_DIR=${DATA_DIR} $(COMPOSE) up -d

build:
	$(COMPOSE) build

down:
	$(COMPOSE) down

start:
	$(COMPOSE) start

stop:
	$(COMPOSE) stop

re: down up

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

clean:
	$(COMPOSE) down --remove-orphans

fclean:
	$(COMPOSE) down -v --remove-orphans --rmi local

seeds:
	cd services/seed_generator/srcs && node index.js

.PHONY: all up down start stop build re logs ps clean fclean bootstrap seeds