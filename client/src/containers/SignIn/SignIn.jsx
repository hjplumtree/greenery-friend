import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userProfileState } from "Atoms";
import { useSetRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import {
  Main,
  Section,
  FormInputWrap,
  SignUpLinkWrap,
  FormHeader,
} from "./SignIn.style";
import { HomeLogo, TextInput, SubmitButton } from "components";
import { validateForm } from "./validation";

import axios from "axios";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // recoil global state Update Function
  const setUserProfile = useSetRecoilState(userProfileState);
  const [cookies, setCookie, removeCookie] = useCookies([]);

  const textInputList = [
    {
      placeholder: "이메일",
      autoComplete: "on",
      minLength: 12,
      maxLength: 32,
      onBlur: setEmail,
    },
    {
      type: "password",
      placeholder: "비밀번호",
      autoComplete: "on",
      minLength: 8,
      maxLength: 12,
      onBlur: setPassword,
    },
  ];

  const onLoginRequest = async data => {
    const url = "/api/users/login";
    const response = await axios.post(url, data);

    if (!response.data.isOk) {
      throw new Error(`${response.data.message}`);
    }
    return response;
  };

  // 로그인 성공시 access token을 axios의 headers의 deafult로 설정
  const setAxiosDefaultAccessToken = response => {
    const { access_token } = response.data;

    axios.defaults.headers.common["Authorization"] = access_token;
  };

  // set global userProfileState
  const handleUserProfile = async () => {
    const response = await axios.get("/api/users/auth");
    const { email, id, name, profileImg } = response.data;

    setUserProfile(prev => {
      const newUserProfile = { ...prev, email, id, name, profileImg };
      return newUserProfile;
    });
  };

  // refresh_token을 이용하여 access_token 재발급
  // const refreshAccessToken = () => {
  //   axios
  //     .post("/api/users/refresh")
  //     .then(response => setAxiosDefaultAccessToken(response));
  // };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm([email, password])) {
      return;
    }

    onLoginRequest({ email, password })
      .then(response => {
        const JWT_EXPIRY_TIME = response.data.exp - Date.now();
        const access_token = response.data.access_token;

        setAxiosDefaultAccessToken(response);
        setCookie("access_token", access_token, {
          path: "/",
          maxAge: JWT_EXPIRY_TIME / 1000,
          // secure: true,
          // httpOnly: true,
        });
        // setTimeout(refreshAccessToken, JWT_EXPIRY_TIME - 10 * 6000);
      })
      .then(() => {
        handleUserProfile();
        navigate("/");
      })
      .catch(err => alert("아이디 또는 비밀번호를 확인해주세요"));
  };

  return (
    <Main>
      <Section>
        <FormHeader>
          <HomeLogo id="form" />
        </FormHeader>
        <form
          onKeyPress={e => handleKeyPress(e)}
          onSubmit={e => handleSubmit(e)}
        >
          <FormInputWrap>
            {textInputList.map(
              ({ title, type, placeholder, autoComplete, onBlur }, index) => {
                return (
                  <TextInput
                    key={index}
                    title={title}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    onBlur={onBlur}
                  />
                );
              },
            )}
          </FormInputWrap>
          <SubmitButton type={"submit"} text={"로그인"}></SubmitButton>
          <SignUpLinkWrap>
            <Link to="/signup">처음 방문하셨나요?</Link>
          </SignUpLinkWrap>
        </form>
      </Section>
    </Main>
  );
}
