import path from "path"
import http from "http"
import fs from "fs"
export const upload = async (dsn: string, file: string, fields: string) => {
    return new Promise((resolve) => {
        const req = http.request(
            `${dsn}?${fields}=${path.basename(file)}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    Connection: "keep-alive",
                    "Transfer-Encoding": "chunked"
                }
            }
        )
        fs.createReadStream(file)
            .on("data", chunk => {
                req.write(chunk);
            })
            .on("end", () => {
                req.end();
                resolve('')
            });
    })
}