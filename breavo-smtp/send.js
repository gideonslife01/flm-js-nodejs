import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Brevo SMTP 서버 주소 / Brevo SMTP server address
  port: 587,
  secure: false, // 587 포트는 STARTTLS 방식을 쓰므로 false로 둡니다. / The 587 port uses STARTTLS, so set it to false.
  auth: {
    user: "b8f43k7001@smtp-brevo.com", // Brevo SMTP 계정 / Brevo SMTP account
    pass: "b5f6e7001.....", // Brevo SMTP 비밀번호 / Brevo SMTP password
  }
});

const mailOptions = {
  from: 'freelifemakers@gmail.com', // Brevo에 등록된 발신자 주소  / Registered sender address in Brevo
  to: 'linux_ma@naver.com',
  
  subject: '"Brevo SMTP 초간단 연동 테스트 / Simple Brevo SMTP Integration Test"', 
  text: "메일 발송 성공했습니다! / Email sent successfully!",

};


async function sendTest() {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ 발송 성공! 메시지 / Success! Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ 발송 실패 에러 내용 / Error occurred while sending email:", error);
  }
}

sendTest();

