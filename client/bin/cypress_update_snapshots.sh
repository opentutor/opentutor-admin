#!/usr/bin/env bash
set -e 
yarn install --frozen-lockfile
npx gatsby telemetry --disable
yarn run develop &
bash ./bin/gatsby_wait_for_ready.sh
npx cypress run --env updateSnapshots=true
