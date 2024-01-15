import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasourceImpl } from "../../infrastucture/datasource/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infrastucture/repositories/todo.repository.impl";


export class TodoRoutes {
    static get routes(): Router{
        const router = Router();

        const datasource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl(datasource);
        const todoController = new TodosController(todoRepository);

        router.get('/', todoController.getTodos);
        router.get('/:id', todoController.getTodoById);
        router.post('/', todoController.createToDo);
        router.put('/:id', todoController.updateToDo);
        router.delete('/:id', todoController.deleteToDo);


        return router;
    }
}