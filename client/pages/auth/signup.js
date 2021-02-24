import { useState } from 'react';
import axios from 'axios';
import useRequest from '../../hooks/use-request'
import Router from 'next/router'
function signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });
    const onSubmit = async (event) => {
        try {
            event.preventDefault();
            await doRequest()
        } catch (error) {
            const message = error.response.data.errors || [{ message: 'Sorry something went wrong' }]
            setErrors(message)
        }
    }
    return (
        <form onSubmit={onSubmit} >
            <h1>Sign Up</h1>
            <div className="form-group" >
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
            </div>
            <div className="form-group" >
                <label>Password</label>
                <input value={password} onChange={e => setEmail(e.target.value)} type="password" className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary" >Sign Up</button>
        </form>
    )
}
export default signup
