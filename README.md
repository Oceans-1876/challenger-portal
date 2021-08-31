## Oceans 1876 Portal

### Setup

> Requires node > 14

- Install dependencies: `npm install`.
- Create a Mapbox account (mapbox.com) and get an API access token from your account page (https://account.mapbox.com).
- Set the `MAPBOX_TOKEN` variable in your environment to the token you created on Mapbox and then run the dev server: `MAPBOX_TOKEN=<your-token> npm start`.

### Build Docker

Set the `MAPBOX_TOKEN` using the instructions in **Setup** and then build the container using the following:

`sh docker.sh`

### Run Docker

To run the container:

`docker run -ti --rm --name frontend -p 8888:80 oceans-1876/frontend`

You can connect using the browser at http://localhost:8888/
