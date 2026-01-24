FROM node:25-alpine3.23

RUN apk add bash && \
    wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
