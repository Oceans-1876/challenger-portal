## Oceans 1876 Portal

### Development guide

> Note: Tested with node v16.6

The UI requires a running instance of the API. If you already have an instance on a remote server,
you can edit `src/config.js` and point `window.API_SERVER` to the correct URL.
Otherwise, you need to run the API locally. To do so, follow the instructions in the [API repo](https://github.com/Oceans-1876/challenger-api/blob/main/README.md).

> You shouldn't commit changes to `src/config.js` to the repository.
>
> TODO: update src/config.js to use environment variables, so we don't have edit this file.

- Install dependencies: `npm install`.
- Run `npm start` to start the development server on port 8080.

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
