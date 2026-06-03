#!/usr/bin/env bash
curl -i \
  -X POST http://localhost:3018/lemo \
  -H 'Content-Type: application/json' \
  -d '{"name":"example","value":"demo"}'
