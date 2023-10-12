import { Database } from "./database.js";
import { buildRoutePath } from "./utils/routePath.js";

const database = new Database();

export const routes = [
    {
        method:"POST",
        path:buildRoutePath("/tasks"),
        handler:(req, res) => {
            const {title, description} = req.body;

            if(!title || !description){
                return res.writeHead(400).end(JSON.stringify({
                    error: "Title and description are required"
                }));
            }

            database.insert(title, description);
            return res.writeHead(201).end();
        }
    },
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler:(req, res) => {
            const {search} = req.query;
            const data = database.select(search);
            return res.writeHead(200, {
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
            try{
                database.change(id, title, description);
            }catch(err){
                return res.writeHead(404).end(JSON.stringify({
                    error: err.message
                }));
            }
            
            return res.writeHead(204).end();
        },
    },
    {
        method:"PATCH",
        path:buildRoutePath("/tasks/:id/complete"),
        handler:(req, res) => {
            const {id} = req.params;
            try{
                database.complete(id);
            }catch(err){
                return res.writeHead(404).end(JSON.stringify({
                    error: err.message
                }));
            }
            return res.writeHead(204).end();
        }
    },
    {
        method:"DELETE",
        path:buildRoutePath("/tasks/:id"),
        handler:(req, res) => {
            const {id} = req.params;
            try{
                database.remove(id);
            }catch(err){
                return res.writeHead(404).end(JSON.stringify({
                    error: err.message
                }));
            }
            return res.writeHead(204).end();
        }
    }
]