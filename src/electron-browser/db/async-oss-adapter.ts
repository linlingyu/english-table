// import OSS from "ali-oss";
import { Adapter } from "lowdb/lib";
// 
const OSS = require("ali-oss");
const oss = new OSS({
    endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    accessKeyId: 'LTAI5t8qJWZQ4LNR2FJLEi6M',
    accessKeySecret: 'JalcPsVVauZTKE5dPUnmzcSfIUiuFf',
    bucket: 'rain-home'
});

export class AsyncOSSAdaptor<T> implements Adapter<T> {
    private source: string = 'english-table/db.json';

    read(): Promise<T | null> {
        return oss.get(this.source)
            .then((response: any) => JSON.parse(response.content.toString()))
            .catch(() => null);
    }

    write(data: T): Promise<void> {
        const content: string = JSON.stringify(data, null, 4);
        return oss.put(this.source, Buffer.from(content))
            .then(() => undefined);
    }
}