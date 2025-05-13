FROM postgres:13@sha256:7f122a2d2c1f2ba92fda0dbd1020bb47ef5b163c1e537e903b7a525e24c1ba44

# Health check and non-privileged user
HEALTHCHECK --interval=15s --timeout=5s --retries=3 CMD [ "pg_isready" ]
USER postgres
