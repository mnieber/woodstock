export COMPOSE_PROJECT_NAME := "woodstock_local"
export ROOT_DIR := `git rev-parse --show-toplevel`
export COMPOSE_DIR := justfile_directory() + "/env/local/docker"

import 'env/local/just/_build_images.just'
import 'env/local/just/_up.just'
import 'env/local/just/_down.just'
import 'env/local/just/_run_image.just'

# Compile .env.in templates into .env files
compile-env-files:
    python env/local/scripts/compile_env_files.py \
        --input env/local/secrets.env \
        env/local/docker/env_files

# Build all images
build *args:
    @just _build_images "{{ args }}" "false"

# Build all images without cache
build-no-cache *args:
    @just _build_images "{{ args }}" "true"

# Start services (with src overlays)
up *args:
    @just _up "{{ args }}" "false" "true"

# Stop services
down:
    @just _down "false" "true"

# Run woodstock-indexer once (--no-loop), with src overlays
run-indexer:
    @just _run_image "woodstock-indexer" "false" "true" woodstock-indexer --no-loop

# Shell into woodstock-indexer, with src overlays
shell-indexer:
    @just _run_image "woodstock-indexer" "false" "true"

# Shell into woodstock-server, with src overlays
shell-server:
    @just _run_image "woodstock-server" "false" "true"

# Format all TypeScript code in woodstock-ui using prettier
format-code:
    cd services/woodstock_ui && npx prettier --write "src/**/*.{ts,tsx}"

# Run woodstock-indexer, woodstock-server and woodstock-ui against a local FS directory.
# Usage: just woodstock-ui /opt/projects/calcium/woodstock/data
run-woodstock data_dir: compile-env-files
    #!/usr/bin/env bash
    set -euox pipefail
    mkdir -p "{{ data_dir }}"
    WOODSTOCK_LOCAL_FS_DIR="{{ data_dir }}" \
    DOCKER_BUILDKIT=1 \
    COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME} \
    ROOT_DIR="${ROOT_DIR}" \
    docker compose \
        --file "${COMPOSE_DIR}/docker-compose.yml" \
        --file "${COMPOSE_DIR}/docker-compose.src-overlays.yml" \
        --file "${COMPOSE_DIR}/docker-compose.local-fs.yml" \
        up woodstock-indexer woodstock-server woodstock-ui
