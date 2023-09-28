import ICSEvent from "./ICSEvent";
import Group from "./Group";

export default interface GroupSchedule {
    group:Group,
    schedule:ICSEvent[],
}