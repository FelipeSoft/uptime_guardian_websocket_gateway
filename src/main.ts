import e, { Request, Response } from "express";
import { configDotenv } from "dotenv"

async function booststrap() {
    configDotenv()
    const app = e();

    app.get("/", (req: Request, res: Response) => {
        res.send("hello world!")
        return
    })

    app.listen(Number(process.env.WEBSOCKET_PORT) || 3030, () => {
        console.log(`Websocket Gateway listening on port ${process.env.WEBSOCKET_PORT || 3030} 👻`)
    })
}

booststrap()