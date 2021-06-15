import {useEffect, useState, useCallback} from 'react'

export default function usePutInCart(nodeProp, containerProp) {

    const [node, setNode] = useState(nodeProp)
    const [container, setContainer] = useState(containerProp)

    useEffect(() => {
        setNode(nodeProp)
        setContainer(containerProp)
    }, [nodeProp, containerProp])

    const putInCart = useCallback(() => {
        if (localStorage) {
            if (!localStorage.partyPizza)
                localStorage.partyPizza = "{}"

            let partyPizza = JSON.parse(localStorage.partyPizza)
                
            partyPizza[node.className] ?
                partyPizza[node.className][node.dataset.id] ? 
                    partyPizza[node.className][node.dataset.id] = partyPizza[node.className][node.dataset.id] + 1
                    :
                    partyPizza[node.className][node.dataset.id] = 1
                :
                partyPizza[node.className] = {[node.dataset.id]: 1}

                
            localStorage.partyPizza = JSON.stringify(partyPizza)

            const cartNodeInfo = document.getElementById("cart").getBoundingClientRect();

            const nodeInfo = node.getBoundingClientRect();

            const clonedNode = node.cloneNode(true);

            container.insertBefore(clonedNode, container.firstElementChild);

            clonedNode.style.position = "fixed";
            clonedNode.style.zIndex = 2;
            clonedNode.style.left = Math.floor(nodeInfo.left) + "px";
            clonedNode.style.top = Math.floor(nodeInfo.top)  + "px";
            clonedNode.style.width = Math.floor(nodeInfo.width) + "px";
            clonedNode.style.height = Math.floor(nodeInfo.height) + "px";

            setTimeout(() => {
                clonedNode.style.left = Math.floor(cartNodeInfo.left) + "px";
                clonedNode.style.top = Math.floor(cartNodeInfo.top)  + "px";
                clonedNode.style.width = Math.floor(cartNodeInfo.width) + "px";
                clonedNode.style.height = Math.floor(cartNodeInfo.height) + "px";
                clonedNode.style.transition = "2s";
            }, 100);

            setTimeout(() => {
                clonedNode.remove();
            }, 2100);
        }
    })

    return putInCart
}
