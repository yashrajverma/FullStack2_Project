import React,{useContext} from 'react'
import { NavLink ,useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {
    const history=useHistory()
    const {state,dispatch}=useContext(UserContext)
    const renderList=()=>{
        if(state){
            return [
                <li key="1"> </li>,
                        <li key="2"><NavLink to="/profile" activeClassName="active-class">Profile</NavLink></li>,
                        <li key="3"><NavLink to="/createpost" activeClassName="active-class">Create Post</NavLink></li>,
                        <li key="4"><NavLink to="/myfollowerspost" activeClassName="active-class">My Following</NavLink></li>,
                        <li key="5">
                            <button className="btn #c62828 red darken-3" onClick={()=>{
                                    localStorage.clear()
                                    dispatch({type:"CLEAR"})
                                    history.push('/signin')
                                }}
                            style={{margin:"auto 10px"}}>
                                Logout
                            </button>
                        </li>
            ]
        }else{
            return [
                <li key="6"><NavLink to="/signin" activeClassName="active-class" >SignIn</NavLink></li>,
                <li key="7"><NavLink to="/signup" activeClassName="active-class">SignUp</NavLink></li>
            ]
        }
    }

    return (
        <div className="navbar-fixed">
            <nav>
                <div className="nav-wrapper white" >
                    <NavLink to={state?"/":'/signin'} className="brand-logo left " style={{marginLeft:"1.2rem"}}>Instagram</NavLink>
                    
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {renderList()}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
