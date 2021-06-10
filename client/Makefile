.env.development:
	@echo "GRAPHQL_ENDPOINT=https://dev-opentutor.pal3.org/graphql/" >> .env.development
	@echo "Set up  a default .env.development file"
	@echo "that configures GRAPHQL_ENDPOINT=https://dev-opentutor.pal3.org/graphql/"
	@echo "and configures CLASSIFIER_ENTRYPOINT=https://dev-opentutor.pal3.org/classifier/."
	@echo "This file should not be committed. "
	@echo "Feel free to change to point to a local server if you're running one."

.PHONY: clean
clean:
	rm -rf .cache public

.PHONY: dependencies-update
dependencies-update:
	npm run dependencies-update

.PHONY: develop
develop: .env.development node_modules/gatsby
	npx gatsby develop

node_modules/cypress:
	$(MAKE) install

node_modules/eslint:
	$(MAKE) install

node_modules/gatsby:
	$(MAKE) install

node_modules/prettier:
	$(MAKE) install

node_modules/typescript:
	$(MAKE) install

.PHONY: format
format:
	cd .. && $(MAKE) format

.PHONY: license
license:
	cd .. && $(MAKE) license

.PHONY: install
install:
	npm ci 

.PHONY: test
test:
	npm run test

.PHONY: test-all
test-all:
	$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-license
	$(MAKE) test-lint
	$(MAKE) test-types

.PHONY: test-audit
test-audit:
	npm run test:audit

.PHONY: test-format
test-format:
	cd .. && $(MAKE) test-format

.PHONY: test-license
test-license:
	cd .. && $(MAKE) test-license

.PHONY: test-lint
test-lint: node_modules/eslint
	npm run test:lint

.PHONY: test-types
test-types: node_modules/typescript
	npm run test:types
