import { Database } from "./database.js";
import { buildRoutePath } from "./utils/routePath.js";

const database = new Database();

export const routes = [
    {
        method:"POST",
        path:buildRoutePath("/tasks"),
        handler:(req, res) => {
            const {title, description} = req.body;
            database.insert(title, description);
            res.writeHead(201).end();
        }
    },
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler:(req, res) => {
            const {search} = req.query;
            const data = database.select(search);
            res.writeHead(200, {
                'Content-Type': 'application/json'
            }).end(JSON.stringify(data));
        }
    },
    {
        method:"PUT",
        path:buildRoutePath("/tasks/:id"),
        handler:(req, res) => {
            const {id} = req.params;
            const {title, description} = req.body;
            database.change(id, title, description);
            res.writeHead(204).end();
        },
    },
    {
        method:"PATCH",
        path:buildRoutePath("/tasks/:id/complete"),
        handler:(req, res) => {
            const {id} = req.params;
            database.complete(id);
            res.writeHead(204).end();
        }
    },
    {
        method:"DELETE",
        path:buildRoutePath("/tasks/:id"),
        handler:(req, res) => {
            const {id} = req.params;
            database.remove(id);
            res.writeHead(204).end();
        }
    }
]