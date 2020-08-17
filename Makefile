PHONY: format
format:
	cd client && $(MAKE) format

PHONY: docker-build
docker-build:
	cd docker && $(MAKE) docker-build

PHONY: test
test:
	cd client && $(MAKE) test

PHONY: test-all
test-all:
	# $(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-types

PHONY: test-audit
test-audit:
	cd client && $(MAKE) test-audit
	cd docker && $(MAKE) test-audit

PHONY: test-format
test-format:
	cd client && $(MAKE) test-format
	cd docker && $(MAKE) test-format

PHONY: test-lint
test-lint:
	cd client && $(MAKE) test-lint
	cd docker && $(MAKE) test-lint

PHONY: test-types
test-types:
	cd client && $(MAKE) test-types
