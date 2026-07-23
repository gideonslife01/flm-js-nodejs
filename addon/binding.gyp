# GYP (Generate Your Projects): 이 형식은 Google에서 개발되었으며,
# 원래는 Chromium 프로젝트를 위해 사용되었습니다.
# 이는 다양한 플랫폼(macOS, Linux, Windows)에서 C++ 프로젝트를 빌드하기 위한 빌드 시스템 설정 언어입니다.

# GYP (Generate Your Projects): This format was developed by Google and was originally used for the Chromium project.
# It is a build system configuration language for building C++ projects on various platforms (macOS, Linux, Windows).

# binding.gyp
{
  "targets": [
    {
      # target_name : 최종적으로 생성될 .node 파일의 이름 / The name of the .node file that will ultimately be created
      # sources : 빌드할 소스 코드 파일 목록을 지정합니다. / Specifies a list of source code files to build.
      # include_dirs : C++ 코드에서 #include <napi.h>를 사용할 수 있도록 합니다. / Enables you to use #include <napi.h> in your C++ code.

      "target_name": "addon_module",
      "sources": [ "addon.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ],

      # C++ 컴파일러 플래그 설정: 예외 처리 활성화 / Setting C++ Compiler Flags: Enable Exception Handling
      # -- C++의 핵심 기능인 try, catch, throw 구문이 컴파일되어 런타임에 제대로 작동할 수 있도록 만듭니다.
      #    The try, catch, and throw statements, which are core features of C++, are compiled so that they work properly at runtime.

      "cflags_cc": [
          "-fexceptions"
      ],

      # (macOS 전용) XCode/Darwin 빌드 설정 오버라이드
      # (macOS only) Override XCode/Darwin build settings

      # 예외처리 기능이 비활성화되면 오류가 발생합니다.
      # 아래의 코드는 맥os의 예외처리 기능을 활성화하는 코드 입니다.
      # An error will occur if exception handling is disabled.
      # The code below enables exception handling in macOS.

      'xcode_settings': {
          'GCC_ENABLE_CPP_EXCEPTIONS': 'YES', # C++ 예외 활성화
          'OTHER_CPLUSPLUSFLAGS': [ '-fexceptions' ] # 추가 플래그
      },

      # 안전을 위해 기본 -fno-exceptions를 제거 (만약 node-gyp 기본 설정에 있다면)
      # Remove default -fno-exceptions for safety (if it's in node-gyp default config)

      # cflags! : C 컴파일러의 예외 비활성화 옵션 제거 / Removed the option to disable exceptions from the C compiler.
      # cflags_cc! : C++ 컴파일러의 예외 비활성화 옵션 제거 / Removed the option to disable exceptions from the C++ compiler.

      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ]
    }
  ]
}
