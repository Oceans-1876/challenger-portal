# ----------------------------------------------------------------------
# First stage, compile application
# ----------------------------------------------------------------------

FROM node:16.6-alpine AS builder

WORKDIR /usr/src/app

# Public Path when building application
ARG PUBLIC_PATH=""
ENV PUBLIC_PATH=${PUBLIC_PATH}

# API Server
ARG API_SERVER
ENV API_SERVER=${API_SERVER}

# Copy application and install dependencies
COPY . /usr/src/app/
RUN npm install

# build application
RUN npm run build

# ----------------------------------------------------------------------
# Second stage, final image
# ----------------------------------------------------------------------

FROM nginx:alpine

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
