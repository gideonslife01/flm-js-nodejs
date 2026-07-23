// addon.cpp
/*
 * 이 코드는 "현재 Node.js 환경(env)에서 C++ 변수 result를 이용하여 새로운 JavaScript 숫자 객체를 만들어 반환하라"는 의미가 됩니다.
 * This code means "Create a new JavaScript numeric object
 * using the C++ variable result in the current Node.js environment (env) and return it."
 *
 * C++ 애드온은 main함수가 없는 이유:Node.js 자체에 이미 거대한 main 함수가 포함되어 있기 때문입니다.
 * Why C++ addons don't have a main function: Because Node.js itself already contains a huge main function.
 *
 * Napi::Number는 node-addon-api 라이브러리에서 제공하는 C++ 클래스로, Node.js 환경에서 통신할 때 JavaScript의 number 타입을 나타냅니다.
 * Napi::Number is a C++ class provided by the node-addon-api library that represents the JavaScript number type when communicating in a Node.js environment.
 *
 * Napi::Number 클래스는 내부적으로 C++의 기본 숫자 타입을 JavaScript가 이해하는 숫자 객체 포맷으로 변환해 줍니다.
 * The Napi::Number class internally converts C++'s basic number type into a numeric object format that JavaScript understands.
*/

// C++ 개발자가 Node.js의 고성능 네이티브 기능을 사용하기위한 헤더
// Header for C++ developers to use high-performance native features of Node.js
#include <napi.h>
#include <iostream>

// JavaScript에서 호출될 C++ 함수 정의
// Define a C++ function to be called from JavaScript
Napi::Number Multiply(const Napi::CallbackInfo& info) {

    // env: 현재 Node.js의 실행 환경(Napi::Env)을 나타냅니다.
    // env: Represents the current Node.js execution environment (Napi::Env).
    Napi::Env env = info.Env();

    // 인자 개수 확인 / Check number of arguments
    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "두 개의 숫자를 입력해야 합니다.").ThrowAsJavaScriptException();
        return env.Null().As<Napi::Number>();
    }

    // JavaScript 인자를 C++ 숫자로 변환
    // Convert JavaScript arguments to C++ numbers
    double a = info[0].As<Napi::Number>().DoubleValue();
    double b = info[1].As<Napi::Number>().DoubleValue();

    // C++ 로직 실행
    // Execute C++ logic
    double result = a * b;
    std::cout << "C++ 애드온에서 곱셈 로직 실행됨: " << a << " * " << b << std::endl;

    // 결과를 JavaScript Number 타입으로 변환하여 반환
    // Convert the result to JavaScript Number type and return it
    // New()는 새로운 JavaScript 객체를 생성하는 메서드
    // New() is a method that creates a new JavaScript object.
    return Napi::Number::New(env, result);
}

// 모듈 초기화 (exports 객체에 함수 등록)
// Initialize module (register functions in exports object)
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        // 자바스크립트에서 addon.multiply(a, b);로 사용됨.
        // Used in JavaScript as addon.multiply(a, b);
        Napi::String::New(env, "multiply"),

        // Function타입은 자바스크립트에서 함수로 사용 할 수 있게 해줌.
        // The Function type allows you to use it as a function in JavaScript.
        // 실제로 실행될 c++ 함수입니다. / This is the c++ function that will actually be executed.
        Napi::Function::New(env, Multiply)
    );
    return exports;
}

// Node.js 모듈로 등록
// Register as a Node.js module
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
