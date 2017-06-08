NODECHROME=2
NODEFIREFOX=2

.PHONY: default up down scale test-e2e

default: up

up:
	docker-compose -f docker-compose-e2e.yml up -d;
	docker-compose -f docker-compose-e2e.yml scale nodechrome=$(NODECHROME) nodefirefox=$(NODEFIREFOX);

down:
	docker-compose -f docker-compose-e2e.yml down;

scale:
	docker-compose -f docker-compose-e2e.yml scale nodechrome=$(NODECHROME) nodefirefox=$(NODEFIREFOX);
	docker restart selenium_hub;

test-e2e:
	docker-compose -f docker-compose-e2e.yml exec web node_modules/.bin/_mocha --timeout 5000 --recursive test/e2e;
