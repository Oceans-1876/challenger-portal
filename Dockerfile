# ----------------------------------------------------------------------
# First stage, compile application
# ----------------------------------------------------------------------

FROM node:14 AS builder

WORKDIR /usr/src/app

# Specify Mapbox Token to use
ARG MAPBOX_TOKEN=""
ENV MAPBOX_TOKEN=${MAPBOX_TOKEN}

# copy only package for caching purposes
COPY package*.json /usr/src/app/
RUN npm install

# copy rest of application
COPY .eslintrc .prettierrc .lintstagedrc .huskyrc typedoc.json tsconfig.json babel.config.json *.js /usr/src/app/
COPY src /usr/src/app/src/

# build application
RUN npm run build

# ----------------------------------------------------------------------
# Second stage, final image
# ----------------------------------------------------------------------

FROM nginx:alpine

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
