# for deploy-builder
FROM golang:1.20-bookworm as deploy-builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
# -trimpath
# -ldflags: arguments to pass on each go tool link invocation.
# "-w" <- disable DWARF generation
# "-s" <- disable symbol table
RUN go build -trimpath -ldflags "-w -s" -o app

# for deploy
FROM debian:bookworm-slim as deploy

RUN apt-get update

COPY --from=deploy-builder /app/app .

CMD [ "./app" ]

# local with hot-reload
FROM golang:1.20.3-alpine as dev

WORKDIR /app

RUN go install github.com/cosmtrek/air@latest
CMD [ "air" ]