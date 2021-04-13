import React, { useState, useContext } from 'react'
import M from 'materialize-css'
import { useHistory, NavLink } from 'react-router-dom'
import { UserContext } from '../../App'
const SignIn = () => {
    const { state, dispatch } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid Email", classes: "#c62828 red darken-1" })
            return
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }, body:
                JSON.stringify({
                    email: email,
                    password: password
                })
        }).then(res =>
            res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-1" })

                } else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Signed In!", classes: "#43a047 green darken-1" })
                    history.push('/')
                }
                console.log(data);
            })
    }

    return (
        <div className="mycard ">
            <div class="card auth-card input-field" >
                <h2 className="brand-logo" >
                    <i class="fa fa-instagram " style={{ fontSize: "42px", marginRight: "6px" }}></i>Instagram
                </h2>
                <input type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }} />

                <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }} />

                <button className="btn waves-effect  #2196f3 blue darken-1 " name="action" style={{ width: "100%" }}
                    onClick={() => PostData()}
                >
                    Sign In
                </button>
                <div style={{ marginTop: "10px" }}>
                    <p>
                        Dont Have an Account?
                        <NavLink to='/signup' className="btn waves-effect waves-light #212121 grey darken-1"
                            style={{ marginLeft: "10px", color: "white" }}> Sign Up</NavLink>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignIn
