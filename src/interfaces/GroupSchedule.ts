import ICSEvent from "./ICSEvent";

export default interface GroupSchedule {
    id:string,
    schedule:ICSEvent[],
}