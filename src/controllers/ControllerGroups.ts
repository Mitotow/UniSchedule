import IController from "../interfaces/IController";
import {Router, Request, Response, NextFunction} from 'express';
import Data from "../providers/Data";
import Logger from "../providers/Logger";

class ControllerGroups implements IController {
    public path = '/groups';
    public router = Router();

    private data = Data.getInstance();
    private logger = Logger.getInstance();

    constructor() {this.init();}
    
    private init() {
        this.router.get('/', (req, res, next) => this.getGroups(req, res, next));
        this.router.get('/*', (req, res, next) => this.getGroupSchedule(req, res, next))
    }

    private getGroups = (req:Request, res:Response, next:NextFunction) => res.send(this.data.getGroups());

    private async getGroupSchedule(req:Request, res:Response, next:NextFunction) {
        const spath = req.path.split('/');
        const id = spath[spath.length-1];
        const schedule = await this.data.getGroup(id);
        if(schedule == undefined) {
            res.status(404);
        } else {
            res.send(schedule);
        }
    }   
}

export default ControllerGroups;