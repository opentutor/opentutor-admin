.env.development:
	@echo "GRADER_GRAPHQL_ENDPOINT=https://dev-opentutor.pal3.org/grading-api/graphql/" >> .env.development
	@echo "Set up  a default .env.development file"
	@echo "that configures GRADER_GRAPHQL_ENDPOINT=https://dev-opentutor.pal3.org/grading-api/graphql/."
	@echo "This file should not be committed. "
	@echo "Feel free to change to point to a local server if you're running one."

.PHONY: clean-build-cypress
clean-build-cypress:
	rm -rf build-cypress

.PHONY: clean
clean: clean-build-cypress
	rm -rf .cache public build-cypress

.PHONY: develop
develop: .env.development node_modules/gatsby-cli
	npx gatsby develop

.PHONY: format
format: node_modules/prettier
	npm run format

node_modules/cypress:
	npm install --frozen-lockfile

node_modules/eslint:
	npm install --frozen-lockfile

node_modules/gatsby-cli:
	npm install --frozen-lockfile

node_modules/jest:
	npm install --frozen-lockfile

node_modules/prettier:
	npm install --frozen-lockfile

node_modules/typescript:
	npm install --frozen-lockfile

.PHONY: snaphots-update
snaphots-update:
	npm run cy:snapshotsUpdate

.PHONY: test
test: node_modules/jest
	npm run test

PHONY: test-all
test-all:
	$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-types
	# $(MAKE) test-cypress
	# $(MAKE) test

.PHONY: test-audit
test-audit:
	npm run test:audit

.PHONY: test-format
test-format: node_modules/prettier
	npm run test:format

.PHONY: test-format
test-lint: node_modules/eslint
	npm run test:lint

.PHONY: test-types
test-types: node_modules/typescript
	npm run test:types

.PHONY: test-cypress
test-cypress: node_modules/cypress
	npm run test:cypress

CYPRESS_IMAGE?=cypress/base:10
.PHONY: cypress-shell
cypress-shell: build-cypress
	docker run \
		--rm \
		-it \
		--entrypoint /bin/bash \
		-v $(PWD)/build-cypress:/client \
		--workdir /client \
	$(CYPRESS_IMAGE)

build-cypress:
	rm -rf build-cypress
	mkdir -p build-cypress
	cp -R bin cypress src static *.json *.js Makefile ./build-cypress
	chmod a+x bin/*
	


.PHONY: cypress-snapshots-update
cypress-snapshots-update: build-cypress
	docker run \
		--rm \
		-it \
		--entrypoint bin/cypress_snapshots_update.sh \
		-v $(PWD)/build-cypress:/client \
		--workdir /client \
	$(CYPRESS_IMAGE)


