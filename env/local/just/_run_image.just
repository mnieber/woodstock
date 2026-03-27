_run_image service_name use_override_file *cmd:
    #!/usr/bin/env bash
    set -euox pipefail
    DOCKER_BUILDKIT=1 \
    COMPOSE_PROJECT_NAME=${COMPOSE_PROJECT_NAME} \
    ROOT_DIR="${ROOT_DIR}" \
    docker compose \
        --file "${COMPOSE_DIR}/docker-compose.yml" \
        {{ if use_override_file == "true" { "--file " + "${COMPOSE_DIR}/docker-compose.override.yml" } else { "" } }} \
        run \
            --rm \
            --remove-orphans \
            --service-ports \
            {{ service_name }} {{ cmd }}
