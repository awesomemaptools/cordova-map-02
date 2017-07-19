#!/usr/bin/env bash
echo "RUNNING hook: before_prepare script: gulp_prod.sh"
export NODE_ENV=prod
gulp clean build:js
