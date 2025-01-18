GREEN := \033[0;32m
RESET := \033[0m

.PHONY: build install publish release

build:
	@echo "$(GREEN)>>> Build packages$(RESET)"
	bun run build

install:
	@echo "$(GREEN)>>> Installing dependencies$(RESET)"
	bun install

publish:
	@echo "$(GREEN)>>> Publish packages$(RESET)"
	npx shipjs trigger

release:
	@echo "$(GREEN)>>> Prepare packages for release$(RESET)"
	npx shipjs prepare
