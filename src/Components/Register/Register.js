import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import * as authService from '../../Services/authservices';
import { useAuthContext } from '../../Contexts/authContext';

import './Register.css';

const Register = () => {

    const { login } = useAuthContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');


    const onRegister = (e) => {
        e.preventDefault();

        const { email, name, password, rePassword } = Object.fromEntries(new FormData(e.currentTarget));

        if (password !== rePassword) {
            return console.error('Passwords missmatch');
        }

        authService.register(email, password)
            .then(authData => {
                console.log(authData);

                login(authData);
                navigate('/');
            })
            .catch(err => console.error(err))
    };


    const onBlurValidationHandler = (e) => {
        e.preventDefault();
        let target = e.currentTarget.name;
        let value = e.currentTarget.value;

        const styleCorrect = "border-color: green"
        const styleNotCorrect = "border-color: red"


        if (target === 'email') {

            const emailRegex = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

            if (!emailRegex.test(value)) {
                return e.currentTarget.style = styleNotCorrect;
            } else {
                e.currentTarget.style = styleCorrect;
                return setEmail(value);
            }

        } else if (target === 'name') {
            if (value.length < 3) {
                return e.currentTarget.style = styleNotCorrect;
            } else {
                e.currentTarget.style = styleCorrect;
                return setName(value);
            }

        } else if (target === 'password') {
            if (value.length < 6) {
                return e.currentTarget.style = styleNotCorrect;
            } else {
                e.currentTarget.style = styleCorrect;
                return setPassword(value);
            }
        } else if (target === 'rePassword') {
            if (value !== password || value.length < 6) {
                return e.currentTarget.style = styleNotCorrect;
            } else {
                return e.currentTarget.style = styleCorrect;
            }
        }
    };

    return (
        <>
            <h1 className="page-title">Register</h1>
            <Form className="register-form" onSubmit={onRegister}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control className='input-area' type="email" name="email" onBlur={onBlurValidationHandler} placeholder="Enter email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control className='input-area' type="text" name="name" onBlur={onBlurValidationHandler} placeholder="Enter your name" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control className='input-area' type="password" name="password" onBlur={onBlurValidationHandler} placeholder="Password" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicRePassword">
                    <Form.Label>Repeat password</Form.Label>
                    <Form.Control className='input-area' type="password" name="rePassword" onBlur={onBlurValidationHandler} placeholder="Repeat password" required />

                </Form.Group>
                <Button className='primary-button' variant="primary" type="submit">
                    Register
                </Button>
                <Form.Text>
                    You already have an account? <Link to="/login">Login from here</Link>
                </Form.Text>
            </Form>
        </>
    );
}

export default Register;