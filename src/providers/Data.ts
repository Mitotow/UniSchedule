import fs from 'fs';
import path from 'path';
import axios from 'axios';
import xml2js from 'xml2js';
import Logger from './Logger';
import XMLData from '../interfaces/XMLData';
import Ical from '../tools/Ical';
import Group from '../interfaces/Group';

export default class Data {
    private static instance : Data | null = null;
    private pdata = path.join(__dirname, '../../data');
    private logger = Logger.getInstance();
    private scheduleUrl = 'https://edt.univ-nantes.fr/iut_nantes/';
    private groupsData : Group[] = [];

    public static getInstance() : Data {
        if(this.instance == null) this.instance = new Data();
        return this.instance;
    }

    constructor() {this.init();}

    private async init() {
        if(!fs.existsSync(this.pdata)) {
            fs.mkdirSync(this.pdata);
        }

        await this.fetchGroupsData();                                                       // Fetch groups data
        setInterval(() => {
            this.fetchGroupsData();                                                   // Fetch groups data every 30 minutes
        }, 1800000);
    }

    private async fetchGroupsData() {
        try {
            const raw = await axios.get('https://edt.univ-nantes.fr/iut_nantes/finder.xml');                    // Get content of finder page
            const rawparse : {finder: {resource: any}} = await xml2js.parseStringPromise(raw.data);             // Parsing content into ts object
            const data : XMLData[] = rawparse.finder.resource;                                                  // Get groups infos
            this.groupsData = [];  

            await Promise.all(data.filter(e => e.$.type == 'group').map(async (group) => {
                const icsPath = path.join(this.scheduleUrl,`g${group.$.id}.ics`);                               // Path to .ics file
                const res = await Ical.fromURL(icsPath);                                                        // Fetch group schedule
                if(res != null) {
                    let obj : Group = {group:group,schedule:res};                                
                    this.groupsData.push(obj);
                    this.logger.info(`Parsed group ${group.name}`);
                    try {
                        fs.writeFileSync(path.join(this.pdata, `${obj.group.$.id}.json`), JSON.stringify(obj)); // Store data in .json file
                    } catch(err) {
                        this.logger.error(err);                                                                 // Error while writing in file
                    }
                }
            }));
        } catch(err) {
            this.logger.error(err);
        }

    }   

    public getGroup(id:string) : Group | undefined {
        return this.groupsData.find(g => g.group.$.id === id);
    }

    public getGroups() : Group[] {
        return this.groupsData;
    }
    
}