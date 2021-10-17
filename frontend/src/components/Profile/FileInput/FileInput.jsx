import React, {useRef} from 'react';
import './FileInput.css'

export default function FileInput({change}) {

    const inpRef = useRef();

    const click = () => {
        inpRef.current.click()
    }

    return (
        <button type="button" className="FileInput" onClick={click}>
            <input name="photo" type="file" ref={inpRef} onChange={e => change(e)}/>
            new photo
        </button>
    )
}
