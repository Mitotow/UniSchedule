import IController from "../interfaces/IController";
import {Router, Request, Response, NextFunction} from 'express';
import Data from "../providers/Data";

class ControllerPing implements IController {
    public path = '/ping';
    public router = Router();
    
    private data = Data.getInstance();

    constructor() {this.init();}
    
    private init() {
        this.router.get('/', (req, res, next) => this.ping(req, res, next));
    }

    private ping(req:Request, res:Response, next:NextFunction) {
        res.statusCode = 200;
        res.send('Pong !');
    }
}

export default ControllerPing;