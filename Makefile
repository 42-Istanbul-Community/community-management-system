COMPOSE_FILE = ./deploy/compose.yml

all: up

up:
	docker compose --env-file ./.env -f $(COMPOSE_FILE) up -d --build

down:
	docker compose --env-file ./.env -f $(COMPOSE_FILE) down

start:
	docker compose --env-file ./.env -f $(COMPOSE_FILE) start

stop:
	docker compose --env-file ./.env -f $(COMPOSE_FILE) stop

re: down up

logs:
	docker compose --env-file ./.env -f $(COMPOSE_FILE) logs -f

ps:
	docker compose --env-file ./.env -f $(COMPOSE_FILE) ps

clean:
	docker compose down --remove-orphans

fclean:
	docker compose down -v --remove-orphans --rmi local

.PHONY: all up down	start stop re logs ps clean fclean