export abstract class BaseFe {
    private feId: string = ''
    private feFrom: string = ''
    constructor(feId?: string, feFrom?: string) {
        this.feId = feId ?? '';
        this.feFrom = feFrom ?? '';
        this.on()
    }
    getFeId(): string {
        return this.feId;
    }
    getFeFrom(): string {
        return this.feFrom;
    }
    setFeFrom(feFrom: string): void {
        this.feFrom = feFrom;
    }
    setFeId(feId: string): void {
        this.feId = feId;
    }
    abstract on(): void;
}