.PHONY: Run App

all: up

up:
	docker-compose up

down:
	docker-compose down --remove-orphans

build:
	docker-compose build

logs:
	docker-compose logs -f

clean:
	docker-compose down --remove-orphans --rmi all --volumes

restart:
	docker-compose up -d --build $(service)

dev: up logs

server:
	docker-compose up server

client:
	docker-compose up client

ps:
	docker-compose ps