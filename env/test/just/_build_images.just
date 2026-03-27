_build_images containers use_no_cache:
    #!/usr/bin/env bash
    set -euox pipefail
    DOCKER_BUILDKIT=1 \
    COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME} \
    ROOT_DIR="${ROOT_DIR}" \
    docker compose \
        --file "${COMPOSE_DIR}/docker-compose.yml" \
        --progress=plain \
        build {{ if use_no_cache == "true" { "--no-cache" } else { "" } }} {{ containers }}
