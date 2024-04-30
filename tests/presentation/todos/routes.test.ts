import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/sqlserver';
import { error } from 'console';
import { text } from 'stream/consumers';
import { send } from 'process';


describe('Todo route testing',()=>{

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach(async() => {
        await prisma.todo.deleteMany();
    })

    const todo1 = {text: 'Hola mundo 1'};
    const todo2 = {text: 'Hola mundo 2'};

    test('Should return TODOs api/todos', async() => {


        await prisma.todo.createMany({
            data: [todo1, todo2]
        });

        const {body} = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);
        expect(body[0].completedAt).toBeNull();


    });

    // test2
    test('Should return a TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({
            data: todo1
        });

        const {body} = await request(testServer.app)
        .get(`/api/todos/${todo.id}`)
        .expect(200);

        //console.log(body)

        expect(body).toEqual({
            id: todo.id,
            text: todo.text,
            completedAt: todo.completedAt
        })

    });

    test('Should return a 404 NotFound api/todos/:id', async() => {

        const todoId = 999;
        const {body} = await request(testServer.app)
        .get(`/api/todos/${todoId}`)
        .expect(404);

        //console.log({body})

        expect(body).toEqual({error: `Todo with id ${todoId} not found`});


    })

    test('Should return a new Todo api/todos/', async() => {

        const {body} = await request(testServer.app)
        .post('/api/todos')
        .send(todo1)
        .expect(201);

        //console.log({body})

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        });

    })

    test('Should return an error if text is present api/todos/', async() => {

        const {body} = await request(testServer.app)
        .post('/api/todos')
        .send({})
        .expect(400);

        //console.log({body})

        expect(body).toEqual({ error: expect.any(String)});

    })

    
    test('Should return an error if text is empty api/todos/', async() => {

        const {body} = await request(testServer.app)
        .post('/api/todos')
        .send({text: ''})
        .expect(400);

        expect(body).toEqual({ error: expect.any(String)});

    })

    test('Should return an updated todo api/todos/:id', async() => {

        const todo =  await prisma.todo.create({ data: todo1});

        const {body} = await request(testServer.app)
        .put(`/api/todos/${todo.id}`)
        .send({ text: 'Hola mundo updated',  completedAt: '2024-04-29' })
        .expect(200);

        //console.log({body})

        expect(body).toEqual({ 
            id: expect.any(Number),
            text: 'Hola mundo updated',
            completedAt: '2024-04-29T00:00:00.000Z'
        });
    })

    test('Should return a 404 NotFound api/todos/:id', async() => {

        const {body} = await request(testServer.app)
        .put(`/api/todos/999`)
        .send({ text: 'Hola mundo update2', completedAt: '2023-05-06'})
        .expect(404)

        //console.log({body})

        expect(body).toEqual({error: `Todo with id 999 not found`});


    })

    // TODO: REALIZAR LA OPERACION CON ERRORES PERSONALIZADOS
    test('Should return an updated TODO only the date api/todos/:id', async() => {

        const todo = await prisma.todo.create({data: todo1});

        const {body} = await request(testServer.app)
        .put(`/api/todos/${todo.id}`)
        .send({ completedAt: '2023-05-06'})
        .expect(200)

        //expect(body).toEqual({error: `Todo with id ${todoId} not found`});
        expect(body).toEqual({ 
            id: expect.any(Number),
            text: todo1.text,
            completedAt: '2023-05-06T00:00:00.000Z'
        });

    })


    test('Should delete a todo api/todos/:id', async() => {

        const todo =  await prisma.todo.create({ data: todo1});

        const {body} = await request(testServer.app)
        .delete(`/api/todos/${todo.id}`)
        .expect(200);

        expect(body).toEqual({ 
            id: todo.id,
            text: todo.text,
            completedAt: todo.completedAt
        });
    })

    test('Should return 404 if todo not exist api/todos/:id', async() => {


        const {body} = await request(testServer.app)
        .delete(`/api/todos/999`)
        .expect(404);

        console.log({body})

        expect(body).toEqual({error: 'Todo with id 999 not found' });
    })


})