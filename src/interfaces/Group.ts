import ICSEvent from "./ICSEvent";
import XMLData from "./XMLData";

export default interface Group {
    group:XMLData,
    schedule:ICSEvent[],
}