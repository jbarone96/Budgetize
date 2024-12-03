import React, { useState } from "react";
import "./Login.css";
import InputComponent from "../Other/Input/Input";
import Button from "../Other/Button/Button";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);

  const navigate = useNavigate();

  //Sign Up
  const handleSignUp = () => {
    if (
      name !== " " &&
      email !== " " &&
      password !== " " &&
      confirmPassword !== " "
    ) {
      setLoading(true);
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
      }
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          //Signed In
          const user = userCredential.user;
          toast.success("Sign in Successful!");
          setLoading(false);
          setLoginForm(true);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");

          createDoc(user);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    } else {
      toast.error("Please fill out all fields.");
      setLoading(false);
    }
  };

  //Sign In
  const handleSignIn = () => {
    setLoading(true);
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          toast.success("Login Successful!");
          setEmail("");
          setPassword("");
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    } else {
      toast.error("Please fill out all fields.");
      setLoading(false);
    }
  };

  const createDoc = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName ? user.displayName : user.email,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const googleAuth = () => {
    setLoading(true);

    try {
      signInWithPopup(auth, provider).then((result) => {
        //Google Access Token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        //Signed In User Information
        const user = result.user;
        console.log(user);
        createDoc(user);
        navigate("/dashboard");
        toast.success("Login Successful!");
        setLoading(false);
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login into{" "}
            <span style={{ color: "var(--primary-purple" }}>Budgetize</span>
          </h2>
          <InputComponent
            type={"email"}
            state={email}
            setState={setEmail}
            placeholder={"Enter Email Address"}
          />
          <InputComponent
            type={"password"}
            state={password}
            setState={setPassword}
            placeholder={"Password"}
          />
          <Button
            text={loading ? "Loading..." : "Login"}
            disabled={loading}
            onClick={handleSignIn}
            purple={true}
          />
          <p className="or-name">or</p>
          <Button
            text={loading ? "Loading..." : "Login with Google"}
            onClick={googleAuth}
            purple={false}
            icon={<FcGoogle className="FcGoogle" />}
          />
          <p className="have-an-account">
            Don't have an account?{" "}
            <span
              onClick={() => setLoginForm(false)}
              style={{ cursor: "pointer" }}
            >
              Click Here
            </span>
          </p>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up{" "}
            <span style={{ color: "var(--primary-purple" }}>Budgetize</span>
          </h2>
          <InputComponent
            type={"text"}
            state={name}
            setState={setName}
            placeholder={"Enter your name"}
          />
          <InputComponent
            type={"email"}
            state={email}
            setState={setEmail}
            placeholder={"Enter your email address"}
          />
          <InputComponent
            type={"password"}
            state={password}
            setState={setPassword}
            placeholder={"Password"}
          />
          <InputComponent
            type={"password"}
            state={confirmPassword}
            setState={setConfirmPassword}
            placeholder={"Confirm Password"}
          />
          <Button
            text={loading ? "Loading..." : "Sign Up"}
            disabled={loading}
            onClick={handleSignUp}
            purple={true}
          />
          <p className="or-name">or</p>
          <Button
            text={loading ? "Loading..." : "Sign Up with Google"}
            purple={false}
            icon={<FcGoogle className="FcGoogle" />}
            onClick={googleAuth}
          />
          <p className="have-an-account">
            Already have an account?{" "}
            <span
              onClick={() => {
                setLoading(true);
              }}
              style={{ cursor: "pointer" }}
            >
              Click Here
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default Login;
