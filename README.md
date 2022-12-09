## Oceans 1876 Portal

### Setup

> Tested with node v16.6

- Install dependencies: `npm install`.
- Set the `API_SERVER` variable to your API server. E.g. `http://localhost:8000`, if you're running the API locally.

### Build Docker

You can optionally set the `PUBLIC_PATH` when building the application. Once that is done, build the container using the following:

`sh docker/docker.sh`

### Run Docker

To run the container:

`docker run -ti --rm --name frontend -p 8080:80 oceans-1876/frontend`

You can connect using the browser at http://localhost:8080/
