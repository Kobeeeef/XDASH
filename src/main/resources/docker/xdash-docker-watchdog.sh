#!/bin/bash
export HOSTNAME=$(hostname)
DOCKER_COMPOSE_CONTENT=$(cat <<EOF
${DOCKER_COMPOSE}
EOF
)
PROJECT_NAME="xdash-watchdog-project"
cleanup() {
    echo "Received termination signal. Cleaning up..."
    echo "$DOCKER_COMPOSE_CONTENT" | docker compose -p "$PROJECT_NAME" -f - down -t 0
    exit 0
}
trap cleanup SIGTERM
echo "Stopping existing Docker Compose services..."
echo "$DOCKER_COMPOSE_CONTENT" | docker compose -p "$PROJECT_NAME" -f - down -t 3
echo "Starting Docker Compose services..."
echo "$DOCKER_COMPOSE_CONTENT" | docker compose -p "$PROJECT_NAME" -f - up --abort-on-container-exit