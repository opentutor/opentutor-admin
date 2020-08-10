#!/usr/bin/env bash
set -e 
npm ci
npx gatsby telemetry --disable
bash ./bin/gatsby_start.sh
bash ./bin/wait_for_gatsby.sh
npm run cy:snapshotsUpdate
