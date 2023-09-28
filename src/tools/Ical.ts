import axios from 'axios';
import ical, { FullCalendar } from 'ical';
import ICSEvent from '../interfaces/ICSEvent';

export default class Ical {
	public static fromURL = async (url:string) : Promise<ICSEvent[] | null> => {
		try {
			const response = await axios.get(url);
			return await this.parse(response.data);
		} catch (err) {
			return null;
		}
	}

	public static parse = async (data : string) : Promise<ICSEvent[]> => {
		const vevents : ICSEvent[] = []
		const calendar : FullCalendar = ical.parseICS(data);
		for (const [_, value] of Object.entries(calendar)) {
			let a : string | undefined = undefined
			if(value.summary?.startsWith('XXX')) {
				a = value.summary.split(' - ')[0];
			}
			vevents.push({				
				uid: value.uid,
				start: value.start,
				end: value.end,
				location: value.location,
				staff: value.description?.split('\n').find(el => el.startsWith('Personnel'))?.split(' : ')[1],
				subject: a ? a.split('-')[1] : value.summary?.split(',')[0].split('-')[1],
				type: a ? a.split('-')[0] : value.summary?.split(',')[0].split('-')[0],
			});
		}
		return vevents;
	}
}