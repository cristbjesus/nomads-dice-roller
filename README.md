# NomadsDiceRoller

Dungeons & Dragons RPG dice roller.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.4.

&nbsp;

## Dependencies

- [NodeJS](https://nodejs.org/)
- [Angular](https://angular.io/)
- [Stream](https://getstream.io/)
- [RANDOM.ORG](https://www.random.org/)
- [http-server](https://www.npmjs.com/package/http-server)
- [LocalTunnel](http://localtunnel.github.io/www/)

&nbsp;

## Build Frontend application

Follow the steps below to build the Angular application:


### Frontend development environment build

- Update the `environment.js` file with your [RANDOM.ORG](https://www.random.org/) API key.

    ```javascript
    export const environment = {
        // ...
        randomApiKey: '<YOUR_RANDOM_ORG_API_KEY>'
        // ...
    };
    ```

- Run `ng build --configuration development` to build the project. The build artifacts will be stored in the `dist/` directory.


### Frontend production environment build

- Update the `environment.prod.js` file with your [RANDOM.ORG](https://www.random.org/) API key for the production environment.

    ```javascript
    export const environment = {
        // ...
        randomApiKey: '<YOUR_RANDOM_ORG_PROD_API_KEY>'
        // ...
    };
    ```

- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.


### Frontend production environment build with LocalTunnel

- Update the `environment.prod.js` file with your [RANDOM.ORG](https://www.random.org/) API key for production environment and with your [LocalTunnel](http://localtunnel.github.io/www/) subdomain for API.

    ```javascript
    export const environment = {
        // ...
        randomApiKey: '<YOUR_RANDOM_ORG_PROD_API_KEY>',
        apiUrl: 'https://<YOUR_LOCAL_TUNNEL_API_SUBDOMAIN_NAME>.loca.lt'
        // ...
    };
    ```

- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

&nbsp;

## How to run the application (Frontend and Backend)

Follow the steps below:


### Development environment serve

- Update the `environment.js` file as per [Frontend development environment build](#frontend-development-environment-build) instructions.

- Update the `.env` file with your [Stream](https://getstream.io/) API Key / App Secret.

    ```
    STREAM_API_KEY=<YOUR_STREAM_API_KEY>
    STREAM_APP_SECRET=<YOUR_STREAM_APP_SECRET>
    ```

- Run `./server.js` to start the Backend application. The application will be available at [http://localhost:5500](http://localhost:5500).

- Run `ng serve` to start the Frontend application. The application will be available at [http://localhost:4200](http://localhost:4200).


### Production environment serve

- Update the `environment.prod.js` file as per [Frontend production environment build](#frontend-production-environment-build) instructions.

- Update the `.env` file with your [Stream](https://getstream.io/) API Key / App Secret.

    ```
    STREAM_API_KEY=<YOUR_STREAM_API_KEY>
    STREAM_APP_SECRET=<YOUR_STREAM_APP_SECRET>
    ```

- Run `./server.js` to start the Backend application. The application will be available at [http://localhost:5500](http://localhost:5500).

- Run `ng serve --configuration production` to start the Frontend application. The application will be available at [http://localhost:4200](http://localhost:4200).


### Production environment serve with http-server and LocalTunnel

- Run the [Frontend production environment build with LocalTunnel](#frontend-production-environment-build-with-localtunnel).

- Update the `.env` file with your [Stream](https://getstream.io/) API Key / App Secret and with your [LocalTunnel](http://localtunnel.github.io/www/) subdomains.

    ```
    STREAM_API_KEY=<YOUR_STREAM_API_KEY>
    STREAM_APP_SECRET=<YOUR_STREAM_APP_SECRET>
    LOCAL_TUNNEL_API_SUBDOMAIN_NAME=<YOUR_LOCAL_TUNNEL_API_SUBDOMAIN_NAME>
    LOCAL_TUNNEL_SUBDOMAIN_NAME=<YOUR_LOCAL_TUNNEL_SUBDOMAIN_NAME>
    ```

- Start both the Backend and the Frontend applications by running the `start.sh` shell script. The Backend application will be available at [http://localhost:5500](http://localhost:5500) | `https://<YOUR_LOCAL_TUNNEL_API_SUBDOMAIN_NAME>.loca.lt` and the Frontend application will be available at [http://localhost:8080](http://localhost:8080) | `https://<YOUR_LOCAL_TUNNEL_SUBDOMAIN_NAME>.loca.lt`.

> Note: for LocalTunnel access you need to first access the Backend url via browser and click the Continue button to be able to test the Frontend application (you also need to click the Continue button when accessing the Frontend url).

&nbsp;

## License
[GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)
