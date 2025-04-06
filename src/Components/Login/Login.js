import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

import './Login.css';

import { useAuthContext } from '../../Contexts/authContext';
import * as authService from '../../Services/authservices';

const Login = () => {
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const onLogin = (e) => {
        e.preventDefault();

        const { email, password } = Object.fromEntries(new FormData(e.currentTarget));


        authService.login(email, password)
            .then((authData) => {

                if (!authData.user) {
                    return console.log('error');
                }

                login(authData);
                navigate('/');
            })
            .catch(err => {
                console.error(err);
            });
    };

    const onBlurValidationHandler = (e) => {
        e.preventDefault();

        let target = e.currentTarget.name;
        let value = e.currentTarget.value;

        const styleCorrect = "border-color: green";
        const styleNotCorrect = "border-color: red";

        if (target === 'email') {

            const emailRegex = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

            if (!emailRegex.test(value)) {
                return e.currentTarget.style = styleNotCorrect;
            } else {
                e.currentTarget.style = styleCorrect;
                return setEmail(value);
            }
        } else if (target === 'password') {
            if (value.length < 6) {
                return e.currentTarget.style = styleNotCorrect;
            } else {
                e.currentTarget.style = styleCorrect;
                return setPassword(value);
            }
        }
    }

    function autoLogin() {
        authService.loginWithGoogle()
            .then((user) => {
                let authData = {
                    user: {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        accessToken: user.accessToken
                    }
                };
                login(authData);
                navigate('/');
            })
            .catch(err => console.log(err))

    }

    return (
        <div className='container'>
            <h1 className="page-title">Login</h1>
            <Form className="login-form" onSubmit={onLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control className='input-area' type="email" name="email" onBlur={onBlurValidationHandler} placeholder="Enter email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control className='input-area' type="password" name="password" onBlur={onBlurValidationHandler} placeholder="Password" required />
                </Form.Group>

                <Button className='primary-button' variant="primary" type="submit">
                    Login
                </Button>

                <Form.Text>
                    You don't have an account? <br /> <br /><Link to="/register">Register from here</Link> <br />
                    or
                </Form.Text>

                <Button className='primary-button' onClick={autoLogin}>
                    Login with Google
                </Button>

            </Form>
        </div>
    );
};

export default Login;