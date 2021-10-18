const sumCart = (cart, data) => {
  //Counting total sum of the cart
  //Based on quantities in cart and prices in the database
  let amount = 0;
  for (const categoryKey in cart) {
    for (const itemId in cart[categoryKey]) {
      amount +=
        Number(cart[categoryKey][itemId]) *
        data[categoryKey]
          .filter((item) => {
            if (item._id.toString() === itemId.toString()) return true;
            else return false;
          })
          .map((element) => element.price);
    }
  }
  return amount;
};

export default sumCart;
