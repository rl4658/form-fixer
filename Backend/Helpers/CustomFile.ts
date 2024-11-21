import * as fs from "fs";

export class CustomFile {
    private fileURL: string;

    public constructor(fileURL: string) {
        this.fileURL = fileURL
    }

    public setFileURL(newURL: string) {
        this.fileURL = newURL
    }

    public getFileURL(): string {
        return this.fileURL
    }

    public getFileExtension(): string {
        return this.fileURL.split(".")[1]
    }

    /**
     * 
     * @param csv must be a string 
     * @param delimiter 
     * @returns  an array of JSON data
     */

    public static CSVToJSON(csv, delimiter = ",") {
        const lines = csv.split('\n').filter(Boolean); // Split CSV into lines and remove empty lines
        const headers = lines[0].split(delimiter); // Extract headers (first line)
        const json = lines.slice(1).map(line => {
            const values = line.split(delimiter); // Split each line into values
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index] ? values[index].trim() : null; // Create key-value pairs
                return obj;
            }, {});
        });
        return json;
    }

    public static readFile(url: string) {
        return fs.readFileSync(url, "utf-8")
    }

    public static async writeFile(fileURL: string, content) {
        fs.writeFileSync(fileURL, content, "utf-8")

    }

}
