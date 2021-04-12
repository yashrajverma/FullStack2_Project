import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'
import { NavLink } from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext);
    // console.log(data)

    useEffect(() => {
        fetch('/allpost', {
            headers: { "Authorization": "Bearer " + localStorage.getItem('jwt') }
        })
            .then(res => res.json())
            .then(res => {
                // console.log("all post data",res.post);
                setData(res.post)
            })
    }, [data])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
            , body:
                JSON.stringify({
                    postId: id
                })

        }).then(res => res.json())
            .then(result => {
                // console.log("likes data", result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log("Error from likes", err);
            })
    }

    const UnlikePost = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
            , body:
                JSON.stringify({
                    postId: id
                })

        }).then(res => res.json())
            .then(result => {
                // console.log("Unlikes data", result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log("Error from Unlikes", err);
            })
    }

    const makeComment = (text, id) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
            , body:
                JSON.stringify({
                    postId: id, text
                })

        }).then(res => res.json())
            .then(result => {
                // console.log("comments data", result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log("Error from comment", err);
            })
    }

    const deletePost = (id) => {
        fetch(`/deletepost/${id}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                console.log("delete post", result);
                M.toast({ html: result.message, classes: "#43a047 green darken-1" })
            }).catch(err => {
                console.log("Error from delete", err);
            })
    }

    return (
        <>
            <div className="home">
                {
                    data.map(item => {
                        return (<div className="card home-card" key={item._id}>
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <NavLink exact to={`/profile/${item.postedBy._id == state._id ? "" : item.postedBy._id}`}><h5 style={{ padding: "10px", fontWeight: "bold", display: 'flex', flexDirection: "row" }}
                                ><img src={item.photo} style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "13px" }} />{item.postedBy.name}</h5> </NavLink>
                                {item.postedBy._id == state._id && <i className="material-icons favroite" style={{ float: "right", alignSelf: "center", fontSize: "28px", marginRight: "10px" }} onClick={() => deletePost(item._id)} >delete</i>}
                            </div>


                            <div className="card-image ">
                                <img src={item.photo} alt={item.postedBy.name} />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id) ?
                                    <i className="material-icons favroite" onClick={() => UnlikePost(item._id)} >favorite</i>
                                    : <i className="material-icons favroite-border" onClick={() => likePost(item._id)}>favorite_border</i>
                                }
                                <h6>{item.likes.length} likes</h6>

                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <br />
                                {item.comments.map(record => {
                                    return (
                                        <>
                                            <p><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}</p>
                                        </>
                                    )
                                })}

                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <i className="fa fa-smile-o" style={{ fontSize: "27px", marginRight: "5px" }} aria-hidden="true"></i>
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        makeComment(e.target[0].value, item._id);

                                    }} style={{ width: "100%" }}
                                    >
                                        <input type="text" placeholder="Add Comment..." name="comment" />
                                    </form>
                                </div>
                            </div>
                        </div>)
                    })
                }
            </div>
        </>
    )
}

export default Home
