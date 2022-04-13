# NomadsDiceRoller

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.4.

## Dependencies

- [NodeJS](https://nodejs.org/)
- [Angular](https://angular.io/)
- [Stream](https://getstream.io/)
- [RANDOM.ORG](https://www.random.org/)
- [LocalTunnel](http://localtunnel.github.io/www/)

## Build Frontend application

Follow the steps below to build the Angular application:

### Development environment

- Update the `randomApiKey` environment variable in the `environment.js` file with your [RANDOM.ORG](https://www.random.org/) API key.

    ```javascript
    export const environment = {
        // ...
        randomApiKey: '<YOUR_RANDOM_ORG_API_KEY>'
        // ...
    };
    ```

- Run `ng build --configuration development` to build the project. The build artifacts will be stored in the `dist/` directory.

### Production environment

- Update the `randomApiKey` environment variable in the `environment.prod.js` file with your [RANDOM.ORG](https://www.random.org/) API key for the production environment.

    ```javascript
    export const environment = {
        // ...
        randomApiKey: '<YOUR_RANDOM_ORG_PROD_API_KEY>'
        // ...
    };
    ```

- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Production environment with LocalTunnel

- Update the `randomApiKey` environment variable in the `environment.prod.js` file with your [RANDOM.ORG](https://www.random.org/) API key for the production environment.

    ```javascript
    export const environment = {
        // ...
        randomApiKey: '<YOUR_RANDOM_ORG_PROD_API_KEY>'
        // ...
    };
    ```

- Update the `apiUrl` environment variable in the `environment.prod.js` file with your [LocalTunnel](http://localtunnel.github.io/www/) subdomain for your API.

    ```javascript
    export const environment = {
        // ...
        apiUrl: 'https://<YOUR_LOCAL_TUNNEL_API_SUBDOMAIN_NAME>.loca.lt'
        // ...
    };
    ```

- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## How to run the application (Frontend and Backend)

Follow the steps below:

### Development environment

- Update the `.env` file with your [Stream](https://getstream.io/) API Key / App Secret.

    ```
    STREAM_API_KEY=<YOUR_STREAM_API_KEY>
    STREAM_APP_SECRET=<YOUR_STREAM_APP_SECRET>
    ```

- Run `./server.js` to start the Backend application. The application will be available at [http://localhost:5500](http://localhost:5500).

- Run `ng serve` to start the Frontend application. The application will be available at [http://localhost:4200](http://localhost:4200).

### Production environment

- Update the `.env` file with your [Stream](https://getstream.io/) API Key / App Secret.

    ```
    STREAM_API_KEY=<YOUR_STREAM_API_KEY>
    STREAM_APP_SECRET=<YOUR_STREAM_APP_SECRET>
    ```

- Run `./server.js` to start the Backend application. The application will be available at [http://localhost:5500](http://localhost:5500).

- Run `ng serve --configuration production` to start the Frontend application. The application will be available at [http://localhost:4200](http://localhost:4200).

### Production environment with LocalTunnel

- Build the Angular application.

- Update the `.env` file with your [Stream](https://getstream.io/) API Key / App Secret.

    ```
    STREAM_API_KEY=<YOUR_STREAM_API_KEY>
    STREAM_APP_SECRET=<YOUR_STREAM_APP_SECRET>
    ```

- Update the cors options in the `server.js` file with your [LocalTunnel](http://localtunnel.github.io/www/) subdomain for your Frontend.

    ```javascript
    const corsOptions = {
        // ...
        origin: 'https://<YOUR_LOCAL_TUNNEL_SUBDOMAIN_NAME>.loca.lt'
        // ...
    }
    ```

- Update the commands used to start this application in the `start.sh` file with your [LocalTunnel](http://localtunnel.github.io/www/) subdomains.

    ```sh
    lt --port 5500 --subdomain <YOUR_LOCAL_TUNNEL_API_SUBDOMAIN_NAME> # ...
    lt --port 80 --subdomain <YOUR_LOCAL_TUNNEL_SUBDOMAIN_NAME> # ...
    ```

- Start both the Backend and the Frontend applications by running the `start.sh` shell script. The Backend application will be available at [https://<YOUR_LOCAL_TUNNEL_API_SUBDOMAIN_NAME>.loca.lt]() and The Frontend application will be available at [https://<YOUR_LOCAL_TUNNEL_SUBDOMAIN_NAME>.loca.lt]().

> Note: you need to first access the Backend url via browser and click the Continue button to be able to test the Frontend application (you also need to click the Continue button when accessing the Frontend url).

## License
[GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)