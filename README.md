## Oceans 1876 Portal

### Development guide

> Note: Tested with node v16.6

- Install dependencies: `npm install`.
- Run `npm start` to start the development server on port 8080.

The UI requires a running instance of the API. If you already have an instance on a remote server,
you can run `API_SERVER=<URL of your remote server> npm start`.
Otherwise, you need to run the API locally. To do so, follow the instructions in the [API repo](https://github.com/Oceans-1876/challenger-api/blob/main/README.md).

### Build Docker Image

To build the docker image, run:

> ./docker/build.sh

This will build the image and tag it as `oceans-1876/challenger-portal:latest`. 

If you are going to run the docker image on a url path other than root, e.g. `/challenger`,
you need to set the `PUBLIC_URL` environment variable to that path when building the image, e.g:

> PUBLIC_URL=/challenger ./docker/build.sh`

### Run with Docker

To run the container:

> docker run -ti --rm --name challenger-portal -p 8080:80 oceans-1876/challenger-portal

You can connect using the browser at http://localhost:8080/.
