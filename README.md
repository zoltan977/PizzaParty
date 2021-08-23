## Pizza Party

Pizza Party is an online, mobile-friendly, ReactJS and NodeJS-powered pizza ordering webshop-like application with google and form-based authentication.

## Features

- You can authenticate yourself either by the Google icon on the top right corner or by the "Regisztráció" and "Belépés" forms
- Your registration must be confirmed by a link sent to you via email
- You can change your password on the login page by clicking the "Elfelejtett jelszó" link
- You can choose from several pizza and topping on the Home page
- You can view the details of a product by clicking the info icon on it
- You can put your choosen product into a cart either by the cart icon on it or by the button on the details page
- Cart content can be modified and deleted
- When you are authenticated and the cart is not empty you can fill in an ordering form on the "Új megrendelés" page and send it
- Previous orders can be viewed on the "Megrendelések" page

## Tech

Pizza Party uses a number of open source projects to work properly:

- [ReactJS](https://reactjs.org/) - JavaScript library for building user interfaces
- [node.js](https://nodejs.org/en/) - evented I/O for the backend
- [Express](https://expressjs.com/) - fast node.js network app framework
- [Jest](https://jestjs.io/) - for backend integration tests

And of course Pizza Party itself is open source with a [public repository](https://github.com/zoltan778/exam-project)
 on GitHub.

## Installation

Pizza Party requires [Node.js](https://nodejs.org/) v14+ to run.

Install the dependencies and devDependencies and start the server.
Open your favorite Terminal and run these commands.

First Tab:

```sh
cd backend
npm i
node start.js
```

Second Tab:

```sh
cd frontend
npm i
npm start
```

(optional) Third (for running backend tests):

```sh
cd backend
jest
```

## Docker

Pizza Party is very easy to install and deploy in a Docker container.
You have to build two images.

1. Backend:

You have to run it on port 8000, simply use the Dockerfile to
build the image.

```sh
cd backend
docker build -t <yourusername>/pizza-party-backend
```

This will create the pizza-party-backend image and pull in the necessary dependencies.


Once done, run the Docker image and map the port to port 8000 of the host to
port 8000 of the Docker:

```sh
docker run -d -p 8000:8000 <yourusername>/pizza-party-backend
```

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:8000/api/test
```

2. Frontend:

You have to run it on port 3000, simply use the Dockerfile to
build the image.

```sh
cd frontend
docker build -t <yourusername>/pizza-party-frontend
```

This will create the pizza-party-frontend image and pull in the necessary dependencies.


Once done, run the Docker image and map the port to port 3000 of the host to
port 80 of the Docker:

```sh
docker run -d -p 3000:80 <youruser>/pizza-party-frontend
```

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:3000
```

## License

MIT

