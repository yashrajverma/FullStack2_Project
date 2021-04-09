import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'
import Loading from '../Loading'


const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    useEffect(() => {
        if (url) {
            posted()
        }
    }, [url])

    const posted = () => {
        // create post in server
        fetch("/createpost", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }, body:
                JSON.stringify({
                    title,
                    body,
                    pic: url
                })
        }).then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-1" })
                    setLoading(false)
                } else {
                    M.toast({ html: "Post Created", classes: "#43a047 green darken-1" })
                    setLoading(false)
                    history.push('/')
                }
                console.log(data);
            })
    }

    const postDetails = () => {
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
            }).catch(err => {
                console.log(err);
            })

    }

    return (
        <>

            <div className="card input-field" style={{ margin: "30px auto", padding: "20px", maxWidth: "600px" }}>
                <div><h5 style={{ textAlign: "center", fontWeight: "500" }} className="active-class">Create an Awesome post..</h5></div>
                <input type="text"
                    placeholder="title"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }} />
                <input type="text"
                    placeholder="body"
                    value={body}
                    onChange={(e) => { setBody(e.target.value) }} />

                <div className="file-field input-field">
                    <div className="btn #2196f3 blue ">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <div>
                    {loading ? (<Loading />) : (<button className="btn waves-effect waves-light #2196f3 blue darken-1 "
                        onClick={() => postDetails()} style={{ width: "100%" }}>
                        <i class="fa fa-paper-plane" aria-hidden="true"></i> Post
                    </button>)}
                </div>


            </div>
        </>
    )
}

export default CreatePost
