const express = require('express');
const socketio = require('socket.io');

const http = require('http');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { updateLocale } = require('moment/moment');

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(express.static('public'));

usernames = [];

io.on('connection', socket => {

    // Quando um usuário se conecta
    socket.on('join', (params, callback) => {

        socket.join(params.room);
    
        removeUser(socket.id);

        addUser(socket.id, params.nickname, params.room);

        io.to(params.room).emit('update usernames', userList(params.room));

        socket.emit('new message', Message('->', `Bem vindo ${params.nickname}, você está na sala: ${params.room}`));

        socket.broadcast.to(params.room).emit('new message', Message('.', `${params.nickname} entrou na sala: ${params.room}`));

        socket.on('send message', (message) => {
            io.to(params.room).emit('new message', Message(message.from, message.text));
        });

    // Quando um usuário se desconecta, remove o id do usuário da lista de usuários e atualiza a lista de usuários, emitindo uma mensagem
        socket.on('disconnect', () => {
            let user = removeUser(socket.id);
            if (user) {
                io.to(params.room).emit('update usernames', userList(params.room));
                io.to(params.room).emit('new message', Message('.', `${user.nickname} saiu da sala`));
            }
            callback();
        });

    // Mensagem: Quando um usuário envia uma mensagem, retornando um objeto com o nome do usuário e a mensagem
        function Message(from, text) {
            return { from, text };
        }
        
    // Adição de usuário: Adiciona o usuário ao array de usuários
        function addUser (id, nickname, room) {
            var user = {id, nickname, room};
            usernames.push(user);
            return user;
        }

    // Lista de usuários: Retorna os nomes dos usuários presentes no array, verificando também sua sala
        function userList (room) {
            var users = usernames.filter((user) => user.room === room);
            var names = users.map((user) => user.nickname);
            return names;
        }

    // Remove o usuário: Verifica se o id do usuário do array é igual ao id do usuário que está saindo, filtra o array 
    // e checa se o seu id é diferente do id do usuário que está saindo.
    
        function removeUser (id) {
            for (var i = 0; i < usernames.length; i++) {
                if (usernames[i].id === id) {
                    var user = usernames[i];
                    usernames = usernames.filter((user) => user.id !== id);
                    return user;
                }
            }
        }

    });
});