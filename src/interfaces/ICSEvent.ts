export default interface ICSEvent {
    uid: string | undefined,
    type: string | undefined,
    location: string | undefined,
    subject: string | undefined,
    staff: string | undefined,
    start: Date | undefined,
    end: Date | undefined,
}