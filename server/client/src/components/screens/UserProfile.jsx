import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import Loading from '../Loading'

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams()
    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true)
    // console.log(userid);

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem('jwt') }
        }).then(res => res.json())
            .then(data => {
                // console.log("dat from userprofiel",data);
                setProfile(data)
            })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            }, method: "put",
            body: JSON.stringify({ followId: userid })
        }).then(res => res.json()).then(data => {
            console.log("data from followuser function",data);
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{...prevState.user,
                    followers:[...prevState.user.followers,data._id]}
                }

            })
            setShowFollow(false)
        })
    }

    const UnfollowUser = () => {
        fetch('/unfollow', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt'),
                "Content-Type": "application/json"
            }, method: "put",
            body:
                JSON.stringify({ unfollowId: userid })

        }).then(res => res.json()).then(data => {
            console.log("data from unfollowuser function",data);

            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower=prevState.user.followers.filter(item=>item!=data._id)
                return {
                    ...prevState,
                    user:{...prevState.user,
                    followers:newFollower}
                }

            })
            setShowFollow(true)
        })
    }


    return (
        <>
            {userProfile ? (
                <div style={{ maxWidth: "1000px", margin: "0px auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1.5px solid #ccc" }}>
                        <div>
                            <img src={userProfile.user.pic}
                                alt="yashraj" style={{ width: "160px", height: "160px", borderRadius: "50%" }} />
                        </div>
                        <div>
                            <h2>{userProfile.user.name}</h2>
                            <h6>{userProfile.user.email}</h6>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            <div>
                                {showFollow?<button className="btn waves-effect  #2196f3 blue darken-3"
                                    style={{ margin: "2%" }}
                                    onClick={() => { followUser() }}
                                >follow</button>:<button className="btn waves-effect  #2196f3 blue darken-3"
                                    style={{ margin: "2%" }}
                                    onClick={() => { UnfollowUser() }}
                                >Unfollow</button>}
                                
                            </div>
                        </div>
                    </div>
                    <div className="gallery">{
                        userProfile.posts.map(item => {
                            return (
                                <>
                                    <img key={item._id} className="item" src={item.photo}
                                        alt={item.postedBy.name} />
                                </>
                            );
                        })
                    }

                    </div>

                </div>
            ) : (<Loading />)}


        </>
    )
}

export default Profile
