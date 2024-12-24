export function formatDateTime(time: Date): string {
    const fixZeroFromTime = (time: number) => time < 10 ? `0${time}` : time;
    const hours = fixZeroFromTime(time.getHours());
    const minutes = fixZeroFromTime(time.getMinutes());
    const seconds = fixZeroFromTime(time.getSeconds());
    const day = fixZeroFromTime(time.getDate());
    const month = fixZeroFromTime(time.getMonth() + 1);
    const year = time.getFullYear();
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

export function formatStringToCapitalize(string: string): string {
    const words = string.split(" ");

    for (let w = 0; w < words.length; w++) {
        let currentWord = words[w];
        const firstLetterOfWord = currentWord.substring(0, 1).toUpperCase();
        const restOfWord = currentWord.substring(1, currentWord.length).toLowerCase();
        words[w] = firstLetterOfWord + restOfWord;
    }
    
    return words.join(" ");
}