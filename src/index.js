import {config} from './config.js';
import express from 'express';
import {router} from './routes/index.js';
import { handleErrorMiddleware } from './middlewares/error_handler.js';
import mongoose from 'mongoose';
import cors from 'cors';
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
        mongoose.connect(process.env.MONGODB_URI).then(() => {
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