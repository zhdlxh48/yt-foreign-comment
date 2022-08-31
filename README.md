# 유튜브 해외 댓글 수집기

동영상의 아이디와 설정을 입력하면, 조건에 맞는 해외 사람들이 쓴 댓글만들 추출하는 웹 어플리케이션

CSV로도 추출하여 다운로드가 가능하다

## 사용 라이브러리

- googleapis: 유튜브 데이터 API 접속을 위한 라이브러리
- cls: 텍스트에서 언어를 분석해 특정 국가의 언어를 추측하는 라이브러리
  - 이 라이브러리는 C와 CPP를 사용하므로, 리눅스에서 사용시 GCC와 G++, Make 그리고 빌드를 위한 Python3가 필요함

## 참고

- [도커관련 참고 1](https://owen31302.gitbook.io/github-education/heroku/how-to-deploy-nodejs-application-to-heroku-using-docker#build-the-image-and-push-to-container-registry)
- [도커관련 참고 2](https://www.youtube.com/watch?v=6l55lOyerZk&ab_channel=HariSaktiPutra)
