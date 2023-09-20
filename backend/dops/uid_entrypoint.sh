#!/bin/sh
if ! whoami &> /dev/null; then
  if [ -w /etc/passwd ]; then
    echo "dopsuser:x:$(id -u):0:My User:${HOME}:/sbin/nologin" >> /etc/passwd
  fi
fi
exec "$@"