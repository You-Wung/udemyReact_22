import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const AuthContext = React.createContext({
	token: "",
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
	const currentTime = new Date().getTime();//현재
	const adjExpirationTime = new Date(expirationTime).getTime();//미래

	const remainingDuration = adjExpirationTime - currentTime;
	return (remainingDuration);
};

const retrieveStroedToken = () => {
	const storedToken = localStorage.getItem('token');
	const storedExpirationDate = localStorage.getItem('expirationTime');

	const remainingTime = calculateRemainingTime(storedExpirationDate);
	if (remainingTime <= 60000) {
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');
		return null;
	}
	return {
		token: storedToken,
		duration: remainingTime,
	};
};

const AuthContextProvider = (props) => {
	const tokenData = retrieveStroedToken();
	let initialToken;
	if (tokenData) initialToken = tokenData.token;
	const [token, setToken] = useState(initialToken);

	const userIsLoggedIn = !!token;//token is empty?

	//useEffect안에서 계속 재생성하기에 콜백 최적화
	const logoutHandler = useCallback(() => {
		setToken(null);
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');

		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);

	const loginHandler = (token, expirationTime) => {
		setToken(token);
		localStorage.setItem('token', token);
		localStorage.setItem('expirationTime', expirationTime);

		const remainingTime = calculateRemainingTime(expirationTime);
		logoutTimer = setTimeout(logoutHandler, remainingTime);//id 상수
	};
	
	useEffect(() => {
		if (tokenData)
			logoutTimer = setTimeout(logoutHandler, tokenData.duration);
	}, [tokenData, logoutHandler]);

	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;