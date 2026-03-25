const EventEmitter = require('events');

// Создаем экземпляр EventEmitter
const emitter = new EventEmitter();

// Регистрация обработчика события "message"
emitter.on('message', (user, message) => {
  console.log(`${user}: ${message}`);
});

// Функция отправки сообщения
function sendMessage(user, message, emitter) {
  emitter.emit('message', user, message);
}

// Вызов функции
sendMessage('Alice', 'Hello everyone!', emitter);
sendMessage('Bob', 'Hi Alice!', emitter);
sendMessage('Charlie', 'Good morning!', emitter);
sendMessage('Alice', 'How are you all?', emitter);