import React, { useRef, useState } from 'react';
import './Profile.css';
import { connect } from "react-redux";
import FileInput from './FileInput/FileInput';
import httpClient from 'axios';
import { setUser } from "../../actions/authActions";
import { logout } from "../../actions/authActions";
import LoadingMask from '../LoadingMask/LoadingMask.component';

const Profile = ({user, setUser, logout}) => {
    const form = useRef();
    const [formData, setFormData] = useState({});
    const [formValid, setFormValid] = useState(true);
    const [waitingForServer, setWaitingForServer] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState([]);

    const change = (e) => {
        setError("")
        setErrors([])
        setFormValid(form.current.checkValidity());
        if (e.target.name === "photo")
            setPhoto(e.target.files[0]);
        else
            setFormData({...formData, [e.target.name]: e.target.value})
    }

    const send = async e => {
        setError("")
        setErrors([])

        let form = new FormData();

        form.append('userfile', photo);
        form.append('data', JSON.stringify({ ...formData }));

        setWaitingForServer(true)

        try {
            const response = await httpClient.post(
                '/api/update_profile', 
                form
            );
    
            setUser(response.data);
            
        } catch (error) {
            console.log(error.response.data)

            if (error.response.data?.msg) {
                if (error.response.data.msg.includes("Authentication error"))
                    logout();
                else
                    setError(error.response.data.msg)
            } else if (error.response.data?.errors) {
                setErrors(error.response.data.errors)
            }
        }

        setWaitingForServer(false)

        setFormData({})
        setPhoto(null)
    }

    return (
        <div className="Profile">
            {
                waitingForServer ? <LoadingMask/>
                :

                <div className="content">
                    <h1>Fiók</h1>
                    <form action="" ref={form}>
                        <div className="image">
                            <img src={user.photo} alt="" />
                        </div>
                        <div className="inputs">
                            <input type="text" name="name" 
                                    required value={user.name.trim()} 
                                    onChange={e => {setUser({...user, name: e.target.value }); change(e)}}/>
                            <FileInput change={change}/>
                            <button type="button" disabled={!formValid || (!photo && !Object.keys(formData).length)} onClick={send}>
                                Adatok frissítése
                            </button>
                            {
                                error &&
                                <p className="error">{error}</p>
                            }
                            {
                                errors &&
                                errors.map(err => <p className="error">{err.msg}</p>)
                            }
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps, { setUser, logout })(Profile);
