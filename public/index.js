var socket = io();
var messageForm = document.getElementById('send-message');
var messageBox = document.getElementById('message');
var chat = document.getElementById('chat');
var nickError = document.getElementById('nick-error');

var search = window.location.search.substring(1);
var params = JSON.parse('{"' + decodeURI(search).replace(/&/g, '","').replace(/\+/g, '" "').replace(/=/g, '":"') + '"}');


// Emite uma mensagem, mostrando a mensagem (text) e quem a enviou (from)
messageForm.addEventListener('submit', function (e) {
    e.preventDefault();

    socket.emit('send message', {
        from: params.nickname,
        text: messageBox.value
    });

    messageBox.value = '';
});

// Envia a nova mensagem adicionando-a ao chat
socket.on('new message', function (message) {
    appendMessage(message);
});

// Conecta o usuário através dos params passados na URL
socket.on('connect', function () {
    socket.emit('join', params, function () {});
});

// Atualiza a lista de usuários
socket.on('update usernames', function (users) {
    var usernamesList = document.getElementById('users');
    usernamesList.innerHTML = '';
    for (var i = 0; i < users.length; i++) {
        var user = document.createElement('li');
        var userText = document.createTextNode(users[i]);
        user.appendChild(userText);
        usernamesList.appendChild(user);
    }
});

// Desconecta o usuário e imprime uma mensagem no chat 
socket.on('disconnect', function (message) {
    appendMessage(message);
});

// Adiciona a mensagem ao chat
function appendMessage(message) {
    var insertMsg = document.createTextNode(message.text);
    var li = document.createElement('li');
    var nicklist = document.createElement('span');
    var chat = document.getElementById("chat");
    var nickname = document.createTextNode(message.from + ': ');
    
    nicklist.classList.add('nickname-list');
    li.classList.add('message-list');
    nicklist.appendChild(nickname);
    li.appendChild(nicklist);
    chat.appendChild(li);
    li.append(insertMsg);
};

// Funcionamento do botão de emojis
function emojiButton() {
    var emoji = document.querySelector('#emoji-btn');

    var picker = new EmojiButton({
        position: 'right-start'
    });

    picker.on('emoji', emoji => {
        messageBox.value += emoji;
    });

    emoji.addEventListener('click', function () {
        picker.pickerVisible ? picker.hidePicker() : picker.showPicker(messageBox);
    })
};

// Função que retorna o usuário a tela inicial quando ele sai do chat
function leaveRoom() {
    window.location.href = '/';
}