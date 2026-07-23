// server.js
const express = require("express");
const app = express();
const port = 3000;

// 1. C++ 애드온 로드 / Loading C++ add-ons
// node-gyp 빌드 후 생성되는 .node 파일의 경로를 지정합니다.
// Specifies the path to the .node file generated after building node-gyp.
// (빌드가 성공하면 build/Release/addon_module.node 파일이 생성됩니다.)
// (If the build is successful, the build/Release/addon_module.node file will be created.)
const cppAddon = require("./build/Release/addon_module");

app.use(express.json());

// 2. C++ 애드온을 사용하는 API 엔드포인트 정의
//    Defining API endpoints using C++ add-ons
app.get("/calculate", (req, res) => {
  // 쿼리 파라미터에서 두 숫자를 추출
  // Extract two numbers from query parameters
  const num1 = parseFloat(req.query.a);
  const num2 = parseFloat(req.query.b);

  if (isNaN(num1) || isNaN(num2)) {
    return (
      res
        .status(400)
        //Please enter valid numbers for query parameters 'a' and 'b'.
        .send("쿼리 파라미터 'a'와 'b'에 유효한 숫자를 입력하세요.")
    );
  }

  try {
    // 3. C++ 애드온의 함수 호출 / Calling functions in C++ add-ons
    const result = cppAddon.multiply(num1, num2);

    // 4. 결과를 클라이언트에게 응답 / Reply the results to the client
    res.json({
      input_a: num1,
      input_b: num2,
      source: "C++ Addon",
      result: result,
    });
  } catch (error) {
    console.error("C++ add-on call error:", error.message);
    res.status(500).send("Server internal error occurred");
  }
});

app.listen(port, () => {
  console.log(`Node.js server is running at http://localhost:${port} .`);
  console.log(`Test URL: http://localhost:${port}/calculate?a=123&b=4.5`);
});
