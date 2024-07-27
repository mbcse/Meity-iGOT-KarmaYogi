#!/bin/bash
pnpm run server &
jest /services/tests

docker compose down
docker compose rm


exit 0
