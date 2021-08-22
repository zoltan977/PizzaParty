//Animation for putting an item to cart
const moveToCart = (node, container) => {
  const cartNodeInfo = document.getElementById("cart").getBoundingClientRect();
  const nodeInfo = node.getBoundingClientRect();
  const clonedNode = node.cloneNode(true);

  container.insertBefore(clonedNode, container.firstElementChild);

  clonedNode.style.position = "fixed";
  clonedNode.style.zIndex = 2;
  clonedNode.style.left = Math.floor(nodeInfo.left) + "px";
  clonedNode.style.top = Math.floor(nodeInfo.top) + "px";
  clonedNode.style.width = Math.floor(nodeInfo.width) + "px";
  clonedNode.style.height = Math.floor(nodeInfo.height) + "px";

  setTimeout(() => {
    clonedNode.style.left = Math.floor(cartNodeInfo.left) + "px";
    clonedNode.style.top = Math.floor(cartNodeInfo.top) + "px";
    clonedNode.style.width = Math.floor(cartNodeInfo.width) + "px";
    clonedNode.style.height = Math.floor(cartNodeInfo.height) + "px";
    clonedNode.style.transition = "2s";
  }, 100);

  setTimeout(() => {
    clonedNode.remove();
  }, 2100);
};

export default moveToCart;
