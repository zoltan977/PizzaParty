import React, { useRef, useEffect } from "react";

//Editable element for username in the navbar
export default function ContentEditable(props) {
  const { onChange } = props;
  const element = useRef();
  let elements = React.Children.toArray(props.children);

  const keyUpHandler = () => {
    if (!element.current) return;

    //if username is an empty string then fills it in with spaces
    if (!element.current.innerText) {
      let spaces = String.fromCharCode(160);
      for (let index = 0; index < 2; index++) {
        spaces += spaces;
      }
      element.current.innerText = spaces;
    }

    //calls onChange in the props
    onChange(element.current.innerText);
  };

  useEffect(() => {
    //if username is an empty string then fills it in with spaces
    if (element.current && !element.current.innerText) {
      let spaces = String.fromCharCode(160);
      for (let index = 0; index < 2; index++) {
        spaces += spaces;
      }
      element.current.innerText = spaces;
    }
  }, []);

  elements = React.cloneElement(elements[0], {
    contentEditable: true,
    suppressContentEditableWarning: true,
    ref: element,
    onKeyUp: keyUpHandler,
  });

  return elements;
}
