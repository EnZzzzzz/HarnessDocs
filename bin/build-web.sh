#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
WEB_DIR="${PROJECT_DIR}/web"
EXPORT_DIR="${WEB_DIR}/out"
DIST_DIR="${WEB_DIR}/dist"

if [[ ! -f "${WEB_DIR}/package.json" ]]; then
  echo "错误：未找到 ${WEB_DIR}/package.json" >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "错误：未找到 pnpm，请先安装 pnpm。" >&2
  exit 1
fi

echo "正在构建 Web 项目..."
cd "${WEB_DIR}"
pnpm build

if [[ ! -d "${EXPORT_DIR}" ]]; then
  echo "错误：构建完成，但没有生成 ${EXPORT_DIR}" >&2
  exit 1
fi

rm -rf -- "${DIST_DIR}"
mv -- "${EXPORT_DIR}" "${DIST_DIR}"

echo "构建完成：${DIST_DIR}"
