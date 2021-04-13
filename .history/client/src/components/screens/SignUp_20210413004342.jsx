import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { NavLink, useHistory } from 'react-router-dom'

import Loading from '../Loading';
const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false)
    const history = useHistory();
    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => {
        setLoading(true)
        const data = new FormData();
        data.append("cloud_name", "yashraj28");
        data.append("upload_preset", "instagram");
        data.append("file", image);
        fetch("https://api.cloudinary.com/v1_1/yashraj28/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json())
            .then(data => {
                console.log("data", data);
                setUrl(data.url)
                setLoading(false)
            }).catch(err => {
                console.log(err);
                setLoading(false)
            })
    }
    const uploadFields = () => {
        setLoading(true)
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid Email", classes: "#c62828 red darken-1" })
            setLoading(false)
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }, body:
                JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                    , pic: url
                })
        }).then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-1" })
                    setLoading(false)

                } else {
                    M.toast({ html: "Signed Up!", classes: "#43a047 green darken-1" })
                    setLoading(false)
                    history.push('/signin')
                }
                console.log(data);
            })
    }
    const PostData = () => {

        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }

    }

    return (
        <div className="mycard ">
            <div class="card auth-card input-field" >
                <h2 className="brand-logo" >
                    <i class="fa fa-instagram " style={{ fontSize: "42px", marginRight: "6px" }}></i>
                    Instagram
                </h2>
                <input type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => { setName(e.target.value) }} />

                <input type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }} />

                <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }} />
                <div className="file-field input-field">
                    <div className="btn #2196f3 blue ">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                {loading ? <Loading/>:<button className="btn waves-effect waves-light #2196f3 blue darken-1"
                    type="submit" name="action" onClick={() => PostData()}
                    style={{ width: "100%" }}>
                    Sign Up
                </button>}
                <div style={{ marginTop: "10px" }}>
                    <p>
                        Have an Account?
                        <NavLink to='/signin' className="btn waves-effect waves-light #212121 grey darken-1"
                            style={{ marginLeft: "10px", color: "white" }}> Sign In</NavLink>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
