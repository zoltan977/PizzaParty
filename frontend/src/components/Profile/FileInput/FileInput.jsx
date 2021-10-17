import React, {useRef, useState, useEffect} from 'react';
import './FileInput.css';

function validateImage(image) {
    console.log(image);
    // check the type
    let validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (validTypes.indexOf(image.type) === -1) {
      return false;
    }

    // check the size
    let maxSizeInBytes = 10e6; // 10MB
    if (image.size > maxSizeInBytes) {
      return false;
    }

    return true;
}

export default function FileInput({change}) {

    const inpRef = useRef();
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    const localChange = e => {
        setError("")
        setInfo("")
        
        if (!e.target?.files[0])
            return;

        if (!validateImage(e.target.files[0]))
            setError("A kép mérete vagy típusa nem megfelelő!")
        else {
            setInfo(e.target.files[0].name)
            change(e)
        }
    }

    const click = () => {
        inpRef.current.click()
    }

    return (
        <div className="FileInput">
            <button type="button" onClick={click}>
                <input name="photo" type="file" ref={inpRef} onChange={localChange}/>
                Új fénykép
            </button>
            {
                error &&
                <p className="error">{error}</p>
            }
            {
                info &&
                <p className="info">{info}</p>
            }
        </div>
    )
}
