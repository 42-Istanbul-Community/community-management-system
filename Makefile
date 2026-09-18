include .env
export

PROFILE ?=

COMPOSE = docker compose --env-file ./.env -f $(COMPOSE_FILE)

ifneq ($(PROFILE),)
	COMPOSE += --profile $(PROFILE)
endif

ifeq ($(USE_DATA_DIR),false)
	DATA_DIR := $(shell pwd)/cms-data
endif

all: build up

up:
	mkdir -p \
		${DATA_DIR}/grafana \
		${DATA_DIR}/elasticsearch \
		${DATA_DIR}/prometheus \
		${DATA_DIR}/rustfs
	DATA_DIR=${DATA_DIR} $(COMPOSE) up -d

build: prepare
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

prepare:
	@echo "Preparing secrets..."
	@sudo chown -R 1000:1000 $(shell pwd)/secrets/*.txt
	@sudo chmod 644 $(shell pwd)/secrets/*.txt
	@sudo chmod 600 $(shell pwd)/secrets/elasticsearch_password.txt

.PHONY: all up down start stop build re logs ps clean fclean prepare seeds