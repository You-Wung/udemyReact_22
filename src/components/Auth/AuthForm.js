import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import classes from "./AuthForm.module.css";

const SIGN_UP =
	"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxJ2WH-K35TfCZ9oDmQ9P9SIWyhmsVyDA";
const SIGN_IN =
	"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDxJ2WH-K35TfCZ9oDmQ9P9SIWyhmsVyDA";

const AuthForm = () => {
  const history = useHistory();
	const emailRef = useRef();
	const passwordRef = useRef();
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);

	const switchAuthModeHandler = () => {
		setIsLogin((prevState) => !prevState);
	};

	const submitHandler = (event) => {
		event.preventDefault();

		const enteredEmail = emailRef.current.value;
		const enteredPassword = passwordRef.current.value;

		setIsLoading(true);
		let url;
		if (isLogin) url = SIGN_IN;
		else url = SIGN_UP;

		fetch(url, {
			method: "POST",
			body: JSON.stringify({
				email: enteredEmail,
				password: enteredPassword,
				returnSecureToken: true,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => {
				setIsLoading(false);
				if (res.ok) {
					return res.json();
				} else {
					return res.json().then((data) => {
						let errorMsg = "Authentication failed";
						if (data && data.error && data.error.message)
							errorMsg = data.error.message;
						throw new Error(errorMsg);
					});
				}
			})
			.then((data) => {
        //success
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));

        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/');
      })
			.catch((error) => alert(error.message));
	};

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? "Login" : "Sign Up"}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" id="email" required ref={emailRef} />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input type="password" id="password" required ref={passwordRef} />
				</div>
				<div className={classes.actions}>
					{!isLoading && (
						<button>{isLogin ? "Login" : "Create Account"}</button>
					)}
					{isLoading && <p>Sending request...</p>}
					<button
						type="button"
						className={classes.toggle}
						onClick={switchAuthModeHandler}
					>
						{isLogin ? "Create new account" : "Login with existing account"}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AuthForm;
