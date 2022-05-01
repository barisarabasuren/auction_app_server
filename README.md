# Auction App for Art Galleries

This repository contains two components:

* the **server**, which provides the API to manage the showcase Artworks and perform auctions([Deployed on Heroku]())
* the **database**, MongoDB that connects MongoDB Atlas

This document aims to give an overview about the techstack and API documentation. In addition, the reader gets to know how to install and setup a local development environment.

# Related repositories

* the **mobile client** ([respository](https://github.com/barisarabasuren/auction_app_mobile))

### High-Level Overview
![Architecture](./architecture.jpeg?raw=true)

### Techstack
The entire backend of auction app is written using:
- [node.js](https://nodejs.org/en/)

Extra libraries used were:
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [nodecron](https://www.npmjs.com/package/node-cron)
- [swagger](https://www.npmjs.com/package/swagger-jsdoc)
- [uuid](https://github.com/uuidjs/uuid/)

### API Documentation
An SwaggerUI API documentation can be found [here]().

### Installation
Requirements:
* [node.js](https://nodejs.org/en/)

```zsh
git clone https://github.com/barisarabasuren/auction_app_server
cd ./auction_app_server
npm install
npm run start
```

# DB Model

![Schema](./image/db_model?raw=true)