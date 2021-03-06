NODECHROME=2
NODEFIREFOX=2

.PHONY: default up down client server build kill_ports test test-e2e

default: build

up:
	docker-compose -f docker-compose.yml up -d;
down:
	docker-compose -f docker-compose.yml down;

server:
	npm run start:server;
client:
	npm start
build:
	npm run build

kill_ports:
	sudo kill `sudo lsof -t -i:5432`;

test:
	rm -rf coverage;
	npm run test:standard;
	npm run test:coverage;
	cat coverage/lcov.info | CODACY_PROJECT_TOKEN=6b49b03a50254048ba094c28a04d62ab node_modules/.bin/codacy-coverage;
test-e2e:
	docker-compose -f docker-compose-e2e.yml up -d;
	docker-compose -f docker-compose-e2e.yml scale nodechrome=$(NODECHROME) nodefirefox=$(NODEFIREFOX);
	docker-compose -f docker-compose-e2e.yml exec web node_modules/.bin/_mocha --timeout 5000 --recursive test/e2e;
	docker-compose -f docker-compose-e2e.yml down;
