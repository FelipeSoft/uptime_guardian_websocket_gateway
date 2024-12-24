import { formatDateTime, formatStringToCapitalize } from "@/utils/formatter"

export default class Logger {
    public constructor (
        private readonly unit: string,
        private readonly message: string
    ) {
        const currentRenderedTime = formatDateTime(new Date())
        console.log(`${currentRenderedTime} [${this.unit}] ${this.message}`)
    }
}