import React, { useContext, useRef, useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const Navbar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const history = useHistory()
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])
    const fetchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body:
                JSON.stringify({ query })
        }).then(res => res.json()).then(result => {
            setUserDetails(result.user);
            console.log(result);
        }
        ).catch(err => {
            console.log(err);
        })
    }
    const renderList = () => {
        if (state) {
            return [
                <li key="1" className="nav-item"><i data-target="modal1" className="material-icons modal-trigger"
                    style={{ cursor: "pointer", color: "black" }}>search</i> </li>,
                <li key="2" className="nav-item"><NavLink to="/profile" activeClassName="active-class">Profile</NavLink></li>,
                <li key="3" className="nav-item"><NavLink to="/createpost" activeClassName="active-class">Create Post</NavLink></li>,
                <li key="4" className="nav-item"><NavLink to="/myfollowerspost" activeClassName="active-class">My Following</NavLink></li>,
                <li key="5" className="nav-item">
                    <button className="btn #c62828 red darken-3" onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        history.push('/signin')
                    }}
                        style={{ margin: "auto 10px" }}>
                        Logout
                            </button>
                </li>
            ]
        } else {
            return [
                <li key="6" className="nav-item"><NavLink to="/signin" activeClassName="active-class" >SignIn</NavLink></li>,
                <li key="7" className="nav-item"><NavLink to="/signup" activeClassName="active-class">SignUp</NavLink></li>
            ]
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink to={state ? "/" : '/signin'} className="brand-logo m2 text-decoration-none" >Instagram</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon float-end"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <ul className="navbar-nav ml-auto text-decoration-none">
                        {renderList()}
                    </ul>
                    </div>
                    <div id="modal1" className="modal" ref={searchModal} style={{ color: "black", padding: "5px" }}>
                        <div className="modal-content">
                            <input type="text"
                                placeholder="Search Users"
                                value={search}
                                onChange={(e) => { fetchUsers(e.target.value) }} />
                            <ul className="collection" style={{ width: "100%" }}>
                                {userDetails.map(item => {
                                    return (
                                        <NavLink to={"/profile/" + item._id} onClick={() => { M.Modal.getInstance(searchModal.current).close() }}>
                                            <li className="collection-item" style={{ color: "black", width: "100%" }}>
                                                <div><img src={item.pic} className="round-pic" /></div><h6>{item.name}</h6>
                                            </li>
                                        </NavLink>
                                    )
                                })}

                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button className="btn waves-effect #2196f3 blue darken-2" onClick={() => setSearch("")}>Clear</button>
                        </div>
                    </div>
            </div>
        </nav>
    )
}

export default Navbar
