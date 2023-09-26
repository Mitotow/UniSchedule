import express from 'express';
import cors from 'cors';
import Logger from './Logger';
import IController from '../interfaces/IController';

class App {
    private static port = 8080;
    private static instance : express.Application | null;

    private static declareInstance() : express.Application {
        const logger = Logger.getInstance();
        const app = express();
        app.use(express.json())
        app.use(cors({
            origin: '*',
            credentials: true
        }));
        app.listen(this.port, () => logger.info('App listening on port', this.port.toString()));
        return app;
    }

    public static getInstance() : express.Application {
        if(this.instance == null) this.instance = this.declareInstance();
        return this.instance;
    }

    public static addController(controller:IController) {
        this.getInstance().use(controller.path, controller.router);
    }
}

export default App;