const express = require('express');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('../swagger.json')

const artworksRouter = require('./routes/artworks/artworks.router');
const authRouter = require('./routes/auth/auth.router');
const bidRouter = require('./routes/bid/bid.router');
const collectionsRouter = require('./routes/collections/collections.router');
const galleriesRouter = require('./routes/galleries/galleries.router');

const app = express()

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(artworksRouter);
app.use(authRouter);
app.use(bidRouter);
app.use(collectionsRouter);
app.use(galleriesRouter);


module.exports = app;