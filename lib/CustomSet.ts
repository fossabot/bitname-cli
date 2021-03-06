interface ISetDict {
    [key: string]: boolean;
}

export default class CustomSet {
    private keys: ISetDict = {};
    public add(item: string) {
        this.keys[item] = true;

        return this;
    }

    public has(item: string) {
        return (item in this.keys);
    }
}
