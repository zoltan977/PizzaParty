## Pizza Party

Pizza Party is an online, mobile-friendly, ReactJS and NodeJS-powered pizza ordering webshop-like application with google and form-based authentication.

## Features

- You can authenticate yourself either by the Google icon on the top right corner or by the "Regisztráció" and "Belépés" forms
- A form registration must be confirmed by a link sent to you via email
- Your password can be changed on the login page by clicking on the "Elfelejtett jelszó" link
- You can choose from several pizza and topping on the Home page
- Product details can be viewed by clicking on the info icon on it
- Chosen products can be put into a cart either by the cart icon on it or by the button on the details page
- Cart content can be modified and deleted
- When you are authenticated and the cart is not empty you can fill in an ordering form on the "Új megrendelés" page and send it
- Previous orders can be viewed on the "Megrendelések" page
- There is a "Új asztalfoglalás" and "Asztalfoglalások" page.
- Table bookings can be made on the "Új asztalfoglalás" page with the help of a table where quarter hour intervals can be chosen.
- Your previous bookings can be seen on the "Asztalfoglalások page"
- And bookings are also entered into the google calendar of the current user if he/she authenticated with google

## Demo

You can test the running upplication on this [demo](https://cryptic-brushlands-33727.herokuapp.com) link.

## API documentation of the backend

On the demo page you can view the API documentation too on this [documentation](https://cryptic-brushlands-33727.herokuapp.com/api/docs) link.

## Tech

Pizza Party uses a number of open source projects to work properly:

- [ReactJS](https://reactjs.org/) - JavaScript library for building user interfaces
- [node.js](https://nodejs.org/en/) - evented I/O for the backend
- [Express](https://expressjs.com/) - fast node.js network app framework
- [MongoDb](https://www.mongodb.com/) - the application data platform
- [Jest](https://jestjs.io/) - for backend integration tests

And of course Pizza Party itself is open source with a [public repository](https://github.com/zoltan977/PizzaParty)
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

## Backend endpoint tests

Integration tests written by jest can be run in a terminal as well

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
docker build -t <yourusername>/pizza-party-backend .
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
docker build -t <yourusername>/pizza-party-frontend .
```

This will create the pizza-party-frontend image and pull in the necessary dependencies.

Once done, run the Docker image and map the port to port 3000 of the host to
port 80 of the Docker:

```sh
docker run -d -p 3000:80 <yourusername>/pizza-party-frontend
```

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:3000
```

## License

MIT
