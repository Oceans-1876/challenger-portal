# ----------------------------------------------------------------------
# First stage, compile application
# ----------------------------------------------------------------------

FROM node:14 AS builder

WORKDIR /usr/src/app

# Specify Mapbox Token to use
ARG MAPBOX_TOKEN=""
ENV MAPBOX_TOKEN=${MAPBOX_TOKEN}

# Public Path when building application
ARG PUBLIC_PATH=""
ENV PUBLIC_PATH=${PUBLIC_PATH}

# Copy application and install dependencies
COPY .. /usr/src/app/
RUN npm install

# build application
RUN npm run build

# ----------------------------------------------------------------------
# Second stage, final image
# ----------------------------------------------------------------------

FROM nginx:alpine

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
