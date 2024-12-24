import { formatStringToCapitalize } from "@/utils/formatter";

describe("testing formatStringToCapitalize function", () => {
    it("should returns a capitalized word", () => {
        const nonCapitalizedWord = "hello";
        const capitalizedWord = formatStringToCapitalize(nonCapitalizedWord);
        expect(capitalizedWord).toBe("Hello");
    });

    it("should returns a capitalized phrase", () => {
        const nonCapitalizedWord = "hello WORld!";
        const capitalizedWord = formatStringToCapitalize(nonCapitalizedWord);
        expect(capitalizedWord).toBe("Hello World!");
    });
})