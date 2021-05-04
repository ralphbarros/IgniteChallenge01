const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username }  = request.headers;
  const user = users.find((user)=> user.username === username);

  if(!user){
    return response.status(404).json({ error: "User not found !!!" });
  }
  request.user = user;
  return next();
}

//get user ToDo
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  if (user.todos.length === 0) {
    return response.json( { message: " This user has no ToDo's !!"} );
  }
  return response.json(  user.todos  );
});

app.get('/users', (request, response) => {
   return response.json(  users  );
});

//create users
app.post('/users',  (request, response) => {
  const { name, username } = request.body;
  
  const checksExistsUserName = users.find(user => user.username === username);
  if(!checksExistsUserName){
    const newUser = {
        id: uuidv4(),
        name,
        username,
        todos: []
      }
      users.push(newUser);
    return response.status(201).json(  newUser  );

  }
    return response.status(400).json({ error: "This user already exist !!"});
});

//Insert user ToDo
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, done , deadline }  = request.body;
  
  const newTodo = {
    id: uuidv4(),
    title,
    done,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  
  
  user.todos.push(newTodo);
  return response.status(201).json({ message: "ToDo inserted" });

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;
  
  const todo = user.todos.find(todo => todo.id === id );
  if(!todo){
    return response.status(404).json({ error: "This ToDo does not Exists"});
  }
  todo.title = title ;
  todo.deadline = new Date(deadline);
  return response.json(user);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;  
  const { id } = request.params;
  
  const todo = user.todos.find(todo => todo.id === id );
  if(!todo){
    return response.status(404).json({ error: "This ToDo does not Exists"});
  }
  todo.done = true ;
  console.log( todo );
  
  return response.json(user);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;  
  const { id } = request.params;
  
  const todo = user.todos.find(todo => todo.id === id );
  if(!todo){
    return response.status(404).json({ error: "This ToDo does not Exists"});
  }
  user.todos.splice(todo,1);

  return response.status(204);
});

module.exports = app;