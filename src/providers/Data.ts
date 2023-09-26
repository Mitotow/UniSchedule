import fs from 'fs';
import path from 'path';
import axios from 'axios';
import xml2js from 'xml2js';
import Logger from './Logger';
import XMLData from '../interfaces/XMLData';
import Ical from '../tools/Ical';
import GroupSchedule from '../interfaces/GroupSchedule';

export default class Data {
    private static instance : Data | null = null;
    private pdata = path.join(__dirname, '../../data');
    private logger = Logger.getInstance();
    private groups : XMLData[] = [];
    private schedules : GroupSchedule[] = [];
    private scheduleUrl = 'https://edt.univ-nantes.fr/iut_nantes';

    public static getInstance() : Data {
        if(this.instance == null) this.instance = new Data();
        return this.instance;
    }

    constructor() {this.init();}

    private async init() {
        if(!fs.existsSync(this.pdata)) {
            fs.mkdirSync(this.pdata);
        }

        await this.fetchGroupsData();
        setInterval(async () => {
            await this.fetchGroupsData();
        }, 108000000);
    }

    private async fetchGroupsData() {
        const pgroups = path.join(this.pdata, 'groups');
        if(!fs.existsSync(pgroups)) {
            fs.mkdirSync(pgroups);
        }
        await axios.get('https://edt.univ-nantes.fr/iut_nantes/finder.xml').then(raw => {
            xml2js.parseString(raw.data, (err, result) => {
                if(err) {
                    this.logger.error(err);
                    return;
                }
                const data : XMLData[] = result.finder.resource;
                this.groups = data.filter(g => g.$.type == 'group');
                this.groups.forEach(g => {
                    this.logger.info('Register group id', g.$.id.toString());
                    fs.writeFileSync(path.join(pgroups, `${g.$.id}.json`), JSON.stringify(g));
                    this.fetchSchedules(g);
                });
            });
        }).catch(_ => {
            return;
        });
    }
    
    private fetchSchedules(g:XMLData) {
        const pSchedules = path.join(this.pdata, 'schedules');
        if(!fs.existsSync(pSchedules)) {
            fs.mkdirSync(pSchedules);
        }

        const id = g.$.id;
        const spath = path.join(this.scheduleUrl, g.$.link);
        Ical.fromURL(spath).then(schedule => {
            if(schedule) {
                this.logger.info(schedule.toString());
                this.schedules.push({
                    id: id,
                    schedule: schedule,
                });
            }
        });
    }

    public getGroups() : XMLData[] {
        return this.groups;
    };

    public getSchedule(id:string) : GroupSchedule | undefined {
        return this.schedules.find(s => s.id == id);
    }
}