const net = require('net');

// 접속된 모든 클라이언트 소켓을 저장할 배열
// Array to store all connected client sockets
const clients = [];

const server = net.createServer((socket) => {
  // 새 클라이언트가 접속하면 배열에 추가
  // Add new client to the array upon connection
  clients.push(socket);
  console.log(`클라이언트가 연결되었습니다. / Client connected. (Total: ${clients.length})`);

  socket.on('data', (data) => {
    const message = data.toString();
    console.log('클라이언트로부터 받은 데이터 / Data received from client:', message);
    
    // 브로드캐스트: 배열에 있는 모든 클라이언트에게 메시지 전송
    // Broadcast: Send message to all clients in the array
    clients.forEach((client) => {
      // 소켓이 정상적으로 열려있는 상태인지 확인 후 전송
      // Check if the socket is writable before sending
      if (client.writable) {
        client.write('브로드캐스트 메시지 / Broadcast message: ' + message);
      }
    });
  });

  socket.on('end', () => {
    console.log('클라이언트 연결 종료 요청 / Client requested disconnection.');
  });

  socket.on('close', () => {
    // 연결이 완전히 끊어지면 배열에서 해당 소켓 제거
    // Remove the socket from the array when completely closed
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log(`클라이언트 연결 해제 완료 / Client disconnected. (Total: ${clients.length})`);
  });

  socket.on('error', (err) => {
    console.error('클라이언트 소켓 에러 / Client socket error:', err);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 리스닝 중입니다. / Server is listening on port ${port}.`);
});

server.on('error', (err) => {
  console.error('서버 에러 / Server error:', err);
});
