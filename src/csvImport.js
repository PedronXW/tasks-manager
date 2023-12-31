import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvParse = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
});

const csvPath = new URL('./tasks.csv', import.meta.url);

async function csvImport(path) {
    const stream = fs.createReadStream(path);

    const linesParse = stream.pipe(csvParse);

    for await (const line of linesParse) {
        const [title, description] = line;

        await fetch('http://localhost:3336/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
            })
        })
    }
}

csvImport(csvPath);

export { csvImport };
