const http = require('http');
const app = require('./app');
const { createAuctionStartSchedulers, createAuctionEndSchedulers, startFailedAuctions, endFailedAuctions } = require('./libs/schedulers');
const { mongoConnect } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
    await mongoConnect();
    await createAuctionStartSchedulers();
    await createAuctionEndSchedulers();
    await startFailedAuctions();
    await endFailedAuctions();
    
    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}...`)
    })
}

startServer()