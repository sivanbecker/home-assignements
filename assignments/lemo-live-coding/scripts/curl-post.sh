#!/usr/bin/env bash
curl -i \
  -X POST http://localhost:3000/lemo \
  -H 'Content-Type: application/json' \
  -d '{"name":"example","value":"demo"}'
