CYPRESS_IMAGE?=cypress/base:12
CYPRESS_DOCKER_ENTRYPOINT?=/bin/bash
CYPRESS_SNAPSHOT_CACHE=$(PWD)/.cypress-snapshot-cache

.env.development:
	@echo "GRAPHQL_ENDPOINT=https://dev-opentutor.pal3.org/grading-api/graphql/" >> .env.development
	@echo "Set up  a default .env.development file"
	@echo "that configures GRAPHQL_ENDPOINT=https://dev-opentutor.pal3.org/grading-api/graphql/."
	@echo "This file should not be committed. "
	@echo "Feel free to change to point to a local server if you're running one."

.PHONY: clean-cypress-snapshot-cache
clean-cypress-snapshot-cache:
	rm -rf $(CYPRESS_SNAPSHOT_CACHE)

.PHONY: clean
clean: clean-cypress-snapshot-cache
	rm -rf .cache public

.PHONY: develop
develop: .env.development node_modules/gatsby-cli
	npx gatsby develop

.PHONY: format
format: node_modules/prettier
	yarn run format

node_modules/cypress:
	yarn install --frozen-lockfile

node_modules/eslint:
	yarn install --frozen-lockfile

node_modules/gatsby-cli:
	yarn install --frozen-lockfile

node_modules/jest:
	yarn install --frozen-lockfile

node_modules/prettier:
	yarn install --frozen-lockfile

node_modules/typescript:
	yarn install --frozen-lockfile

.PHONY: test
test: node_modules/jest
	yarn run test

PHONY: test-all
test-all:
	# $(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-types

.PHONY: test-audit
test-audit:
	yarn run test:audit

.PHONY: test-format
test-format: node_modules/prettier
	yarn run test:format

.PHONY: test-format
test-lint: node_modules/eslint
	yarn run test:lint

.PHONY: test-types
test-types: node_modules/typescript
	yarn run test:types

.PHONY: test-cypress
test-cypress: node_modules/cypress
	yarn run test:cypress

.PHONY: cypress-docker
cypress-docker:
	docker run \
		--rm \
		-it \
		--entrypoint $(CYPRESS_DOCKER_ENTRYPOINT) \
		-v $(PWD):/client \
		-v $(CYPRESS_SNAPSHOT_CACHE)/.cache:/client/.cache \
		-v $(CYPRESS_SNAPSHOT_CACHE)/.yarn.root.cache:/root/.cache \
		-v $(CYPRESS_SNAPSHOT_CACHE)/node_modules:/client/node_modules \
		-v $(CYPRESS_SNAPSHOT_CACHE)/public:/client/public \
		--workdir /client \
	$(CYPRESS_IMAGE)

.PHONY: cypress-update-snapshots
cypress-update-snapshots:
	CYPRESS_DOCKER_ENTRYPOINT=bin/cypress_update_snapshots.sh $(MAKE) cypress-docker


