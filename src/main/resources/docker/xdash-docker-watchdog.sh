#!/bin/bash
export HOSTNAME=$(hostname)
DOCKER_COMPOSE_CONTENT=$(cat <<EOF
${DOCKER_COMPOSE}
EOF
)
cleanup() {
    echo "Received termination signal. Cleaning up..."
    echo "$DOCKER_COMPOSE_CONTENT" | docker compose -f - down
    exit 0
}
trap cleanup SIGTERM
echo "Stopping existing Docker Compose services..."
echo "$DOCKER_COMPOSE_CONTENT" | docker compose -f - down
echo "Starting Docker Compose services..."
while true; do
    if echo "$DOCKER_COMPOSE_CONTENT" | docker compose -p "xdash-watchdog-project" -f - up --abort-on-container-exit; then
        echo "Docker Compose services are running successfully."
    else
        echo "Docker Compose services stopped unexpectedly. Restarting..."
    fi
    echo "$DOCKER_COMPOSE_CONTENT" | docker compose -f - down
    sleep ${TIMEOUT}
done
