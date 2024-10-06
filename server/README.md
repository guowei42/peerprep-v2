# Back-end

The back-end has been split into multiple containerized microservices.

## Setup

1. Make a copy of `.env.template` called `.env` and fill in the variables (or add a pre-filled env file)

## Running

You can run all the services using `docker compose`:

```sh
docker compose build
docker compose up -d
```

## Default port numbers

| **Service** | **Port** |
| ----------- | -------- |
| User        | 3001     |
| Questions   | 3002     |
