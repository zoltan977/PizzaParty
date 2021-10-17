import React, { useRef, useState, useEffect } from 'react';
import './Profile.css';
import { connect } from "react-redux";
import FileInput from './FileInput/FileInput';

const Profile = ({user}) => {
    const form = useRef();
    const [formData, setFormData] = useState({});
    const [formValid, setFormValid] = useState(true);

    const change = (e) => {
        setFormValid(form.current.checkValidity());
        if (e.target.name !== "photo")
            setFormData({...formData, [e.target.name]: e.target.value})
        else
            setFormData({...formData, [e.target.name]: e.target.files})
    }

    useEffect(() => {
        console.log(formData);
    }, [formData])

    return (
        <div className="Profile">
            <form action="" ref={form}>
                <div className="image">
                    <img src={user.photo} alt="" />
                </div>
                <div className="inputs">
                    <input type="text" name="name" required defaultValue={user.name} onChange={change}/>
                    <input type="email" name="email" 
                           pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" 
                           required defaultValue={user.email} onChange={change}/>
                    <FileInput change={change}/>
                    <button type="button" disabled={formValid}>
                        update profile
                    </button>
                </div>
            </form>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps, null)(Profile);
