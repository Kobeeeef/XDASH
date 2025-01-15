#!/bin/bash
DOCKER_COMPOSE_CONTENT=$(cat <<EOF
${DOCKER_COMPOSE}
EOF
)
LOG_FILE="/tmp/xdash-watchdog-logs.txt"
rm $LOG_FILE
touch $LOG_FILE
exec > "$LOG_FILE" 2>&1
cleanup() {
    echo "Received termination signal. Cleaning up..."
    echo "$DOCKER_COMPOSE_CONTENT" | docker compose -f - down
    exit 0
}
trap cleanup SIGTERM
echo "Stopping any existing watchdog scripts..."
kill "$(cat /tmp/xdash-watchdog-pid.txt)" && echo "Previous watchdog stopped."
echo $$ > /tmp/xdash-watchdog-pid.txt
echo "Stopping existing Docker Compose services..."
echo "$DOCKER_COMPOSE_CONTENT" | docker compose -f - down
echo "Starting Docker Compose services..."
while true; do
    if echo "$DOCKER_COMPOSE_CONTENT" | docker compose -f - up --abort-on-container-exit; then
        echo "Docker Compose services are running successfully."
    else
        echo "Docker Compose services stopped unexpectedly. Restarting..."
    fi
    echo "$DOCKER_COMPOSE_CONTENT" | docker compose -f - down
    sleep 2
done
