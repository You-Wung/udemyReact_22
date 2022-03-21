import { useRef, useContext } from 'react';
import { AuthContext } from '../../store/auth-context';
import { useHistory } from 'react-router-dom';
import classes from './ProfileForm.module.css';

const url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDxJ2WH-K35TfCZ9oDmQ9P9SIWyhmsVyDA';

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler =(event)=>{
    event.preventDefault();
    const enteredNewPassword = newPasswordRef.current.value;

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false,//결과리턴
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      //always sucess가정
      history.replace('/');
    });
  };

  return (
		<form className={classes.form} onSubmit={submitHandler}>
			<div className={classes.control}>
				<label htmlFor="new-password">New Password</label>
				<input
					type="password"
					id="new-password"
					minLength="6"
					ref={newPasswordRef}
				/>
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
}

export default ProfileForm;
