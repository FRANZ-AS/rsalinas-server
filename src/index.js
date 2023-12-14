import {config} from './config.js';
import express from 'express';
import {router} from './routes/index.js';
import { handleErrorMiddleware } from './middlewares/error_handler.js';
import mongoose from 'mongoose';

class Server {
   port;
   app;

    constructor(){
        this.port = config.PORT;
        this.app = express();
        this.cors();
        this.middlewares();
        this.routes();
    }

    start(){

        // mongoDB connection
        mongoose.connect("mongodb+srv://rsalinasdb:RXComFqNi5rghpjp@salinas-db.2whie3g.mongodb.net/salinasdb?retryWrites=true&w=majority").then(() => {
            console.log('MongoDB connected');
        } ).catch((err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
        });

        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }

    routes(){
        this.app.use(router); 
        this.app.use(handleErrorMiddleware)
    }

    middlewares(){
        this.app.use(express.json());
    }

    cors(){
        this.app.use(cors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 204,
          }));
    }

}

const server = new Server();
server.start();

// export default Server;