import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class Client {
    public static void main(String[] args) {
        String serverAddress = "localhost";
        int serverPort = 3000;

        try {
            Socket socket = new Socket(serverAddress, serverPort);
            System.out.println("서버에 연결되었습니다. / Connected to the server.");
            
            // 최초 1회만 입력 프롬프트 출력
            // Print the input prompt only once initially
            System.out.print("보낼 메시지 / Send message: ");
            System.out.flush();

            // 1. 서버로부터 메시지를 실시간으로 받는 스레드 시작
            // 1. Start a thread to receive messages from the server in real-time
            Thread receiveThread = new Thread(() -> {

                try (BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {
                    String serverResponse;

                    while ((serverResponse = in.readLine()) != null) {
                        // ANSI 이스케이프 코드 트릭 / ANSI Escape Code Trick
                        // \r: 커서를 줄 맨 앞으로 이동 / Move cursor to start of line
                        // \033[K: 현재 커서가 있는 줄 지우기 / Clear current line
                        System.out.print("\r\033[K"); 
                        
                        // 서버 메시지 출력 / Print server message
                        System.out.println("[서버 응답 / Server Response]: " + serverResponse);
                        
                        // 지워진 입력 프롬프트를 맨 아래에 다시 복구
                        // Restore the cleared input prompt at the bottom
                        System.out.print("보낼 메시지 / Send message: ");
                        System.out.flush();
                    }
                    
                } catch (IOException e) {
                    System.out.println("\n수신 스레드 종료 / Receive thread terminated.");
                }

            });
            receiveThread.start();

            // 2. 메인 스레드: 사용자의 입력을 받아 서버로 전송
            // 2. Main Thread: Take user input and send it to the server
            try (
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                Scanner scanner = new Scanner(System.in)
            ) {
                while (true) {
                    String userInput = scanner.nextLine();
                    
                    if ("exit".equalsIgnoreCase(userInput)) {
                        break;
                    }
                    out.println(userInput);
                    
                    // 내가 엔터를 쳤을 때 화면에 남아있는 프롬프트를 지우고 다시 깔끔하게 출력하게 만듦
                    // Clears the lingering prompt when Enter is pressed and cleanly reprints it
                    System.out.print("\r\033[K보낼 메시지 / Send message: ");
                    System.out.flush();
                }
            }

            socket.close();
            System.out.println("연결을 종료합니다. / Connection terminated.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
