GREEN := \033[0;32m
RESET := \033[0m

.PHONY: build install publish release

build:
	@echo "$(GREEN)>>> Build packages$(RESET)"
	bun run build

install:
	@echo "$(GREEN)>>> Installing dependencies$(RESET)"
	bun install
