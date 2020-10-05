PHONY: format
format:
	cd client && $(MAKE) format

PHONY: test
test:
	cd client && $(MAKE) test

PHONY: test-all
test-all:
	$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-types
	# $(MAKE) test

PHONY: test-audit
test-audit:
	cd client && $(MAKE) test-audit
	cd node && $(MAKE) test-audit

PHONY: test-format
test-format:
	cd client && $(MAKE) test-format
	cd node && $(MAKE) test-format

PHONY: test-lint
test-lint:
	cd client && $(MAKE) test-lint
	cd node && $(MAKE) test-lint

PHONY: test-types
test-types:
	cd client && $(MAKE) test-types
	cd node && $(MAKE) test-types
