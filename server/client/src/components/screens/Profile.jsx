import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import Loading from '../Loading';
import M from 'materialize-css'

const Profile = () => {
    const [pics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('/mypost', {
            headers: { "Authorization": "Bearer " + localStorage.getItem('jwt') }
        }).then(res => res.json())
            .then(data => {
                // console.log(data);
                setPics(data.post)
            })
    }, [])
    useEffect(()=>{
        if(image){
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
                    localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                    dispatch({type:"UPDATEPIC",payload:data.url})
                    setLoading(false)
                   
                    fetch('/updatepic',{
                        method:"put",
                        headers:{"Authorization":"Bearer "+localStorage.getItem('jwt'),"Content-Type":"application/json"},
                        body:JSON.stringify({pic:data.url})
                    }).then(res=>res.json()).then(data=>{
                        console.log("profile pic updated to database",data);
                        M.toast({ html: data.message, classes: "#43a047 green darken-1" })
                    })
                    
                }).catch(err => {
                    console.log(err);
                    setLoading(false)
                    
                })

        }
    },[image])
    const uploadPic = (file) => {
        setLoading(true)
        setImage(file)
    }

    return (
        <div style={{ maxWidth: "1000px", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1.5px solid #ccc" }}>
                <div>
                    <img src={state?state.pic:<Loading/>}
                        alt="yashraj" style={{ width: "160px", height: "160px", borderRadius: "50%" }} />
                        <div className="file-field input-field">
                    {loading?<Loading/>:(<>
                        <div className="btn #2196f3 blue " style={{margin:"10px"}}>
                        <span>Update Image</span>
                        <input type="file" onChange={(e) => uploadPic(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div></>)}
                </div>
                </div>
                <div>
                    <h2>{state ? state.name : <Loading/>}</h2>
                    <h5>{state ? state.email : <Loading/>}</h5>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6>{state ? pics.length: <Loading/>} posts</h6>
                        <h6>{state ? state.followers.length: <Loading/>} followers</h6>
                        <h6>{state ? state.following.length: <Loading/>} following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">{
                pics.map(item => {
                    return (
                        <>{
                            item ? <img key={item._id} className="item" src={item.photo}
                                alt={item.postedBy.name} /> : (<Loading/>)
                        }

                        </>
                    );
                })
            }

            </div>

        </div>
    )
}

export default Profile
