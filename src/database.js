import { randomUUID } from 'crypto';
import fs from 'fs/promises';

const databasePath = new URL('./database.json', import.meta.url);

export class Database {
    #database = []

    constructor() {
        fs.readFile(databasePath).then((data) => {
            this.#database = JSON.parse(data);
            this.#persist();
        }).catch(err => {
            this.#persist();
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(search) {
        let data = this.#database ?? [];

        if (search) {
            data = data.filter((task) => {
                return task.title.includes(search) || task.description.includes(search);
            })
        }

        return data;
    }

    insert(title, description) {
        let data = {
            id: randomUUID(),
            title,
            description,
            created_at: new Date(),
            updated_at: new Date(),
            completed_at: null,
        };

        this.#database.push(data);

        this.#persist();
    }

    change(id, title, description) {
        let data = this.#database.find((task) => task.id === id);

        if (data) {
            data.title = title ?? data.title;
            data.description = description ?? data.description;
            data.updated_at = new Date();
            this.#persist();
        }else{
            throw new Error("Task not found");
        }
    }

    complete(id) {
        let data = this.#database.find((task) => task.id === id);

        if (data) {
            data.completed_at = new Date();
            this.#persist();
        }else{
            throw new Error("Task not found");
        }
    }

    delete(id){
        let data = this.#database.find((task) => task.id === id);

        if (data) {
            this.#database = this.#database.filter((task) => task.id !== id);
            this.#persist();
        }else{
            throw new Error("Task not found");
        }
    }

}