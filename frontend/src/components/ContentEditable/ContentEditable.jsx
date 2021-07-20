import React, { useRef, useEffect } from 'react'

export default function ContentEditable(props) {
    const { onChange } = props;
    const element = useRef();
    let elements = React.Children.toArray(props.children);

    if (elements.length > 1) {
      throw Error("Can't have more than one child");
    }

    const keyUpHandler = () => {
      const value = element.current?.value || element.current?.innerText;
      onChange(value);
    };

    elements = React.cloneElement(elements[0], {
      contentEditable: true,
      suppressContentEditableWarning: true,
      ref: element,
      onKeyUp: keyUpHandler
    });

    return elements;
}
