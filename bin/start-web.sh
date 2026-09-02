#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
DIST_DIR="${PROJECT_DIR}/web/dist"

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-9357}"

if [[ ! -f "${DIST_DIR}/index.html" ]]; then
  echo "错误：未找到构建产物 ${DIST_DIR}/index.html，请先运行 ${SCRIPT_DIR}/build-web.sh。" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "错误：未找到 python3，无法启动静态文件服务。" >&2
  exit 1
fi

if [[ ! "${PORT}" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
  echo "错误：PORT 必须是 1 到 65535 之间的整数，当前值为 ${PORT}。" >&2
  exit 1
fi

echo "正在启动 Web 服务..."
echo "构建目录：${DIST_DIR}"
echo "访问地址：http://${HOST}:${PORT}"

exec python3 -m http.server "${PORT}" --bind "${HOST}" --directory "${DIST_DIR}"
