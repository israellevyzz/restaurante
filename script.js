if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  ready();
}

let totalAmount = 0;

function ready() {
  // Botão remover produto
  const removeCartProductButtons = document.getElementsByClassName("remove-product-button");
  for (let i = 0; i < removeCartProductButtons.length; i++) {
    removeCartProductButtons[i].addEventListener("click", removeProduct);
  }

  // Mudança valor dos inputs
  const quantityInputs = document.getElementsByClassName("product-qtd-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    quantityInputs[i].addEventListener("change", checkIfInputIsNull);
  }

  // Botão adicionar produto ao carrinho
  const addToCartButtons = document.getElementsByClassName("button-hover-background");
  for (let i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", addProductToCart);
  }

  // Botão comprar
  const purchaseButton = document.getElementsByClassName("purchase-button")[0];
  purchaseButton.addEventListener("click", makePurchase);
}

// Remover produto do carrinho
function removeProduct(event) {
  event.target.closest("tr").remove();
  updateTotal();
}

// Checar se input está vazio ou zero
function checkIfInputIsNull(event) {
  const input = event.target;
  const quantity = parseInt(input.value);

  if (isNaN(quantity) || quantity <= 0) {
    input.closest("tr").remove();
  }

  updateTotal();
}

// Adicionar produto ao carrinho
function addProductToCart(event) {
  const button = event.target;
  const productInfos = button.closest(".movie-product");
  const productImage = productInfos.querySelector(".product-image").src;
  const productName = productInfos.querySelector(".product-title").innerText;
  const productPrice = productInfos.querySelector(".product-price").innerText;

  // Verificar se o produto já está no carrinho
  const productsCartNames = document.getElementsByClassName("cart-product-title");
  for (let i = 0; i < productsCartNames.length; i++) {
    if (productsCartNames[i].innerText === productName) {
      const input = productsCartNames[i].closest("tr").querySelector(".product-qtd-input");
      input.value = parseInt(input.value) + 1;
      updateTotal();
      return;
    }
  }

  // Criar nova linha no carrinho
  const newCartProduct = document.createElement("tr");
  newCartProduct.classList.add("cart-product");
  newCartProduct.innerHTML = `
    <td class="product-identification">
      <img src="${productImage}" alt="${productName}" class="cart-product-image">
      <strong class="cart-product-title">${productName}</strong>
    </td>
    <td>
      <span class="cart-product-price">${productPrice}</span>
    </td>
    <td>
      <input type="number" value="1" min="0" class="product-qtd-input">
      <button type="button" class="remove-product-button">Remove</button>
    </td>
  `;

  const tableBody = document.querySelector(".cart-table tbody");
  tableBody.append(newCartProduct);

  // Adicionar eventos aos novos elementos
  newCartProduct.querySelector(".remove-product-button").addEventListener("click", removeProduct);
  newCartProduct.querySelector(".product-qtd-input").addEventListener("change", checkIfInputIsNull);

  updateTotal();
}

// Finalizar compra
function makePurchase() {
  if (totalAmount === 0) {
    alert("Your shopping cart is empty!");
  } else {
    alert(
      `Thanks for the purchase!\nValue of the order: $${totalAmount.toFixed(2)}\nCheck back often :)`
    );

    document.querySelector(".cart-table tbody").innerHTML = "";
    updateTotal();
  }
}

// Atualizar valor total
function updateTotal() {
  const cartProducts = document.getElementsByClassName("cart-product");
  totalAmount = 0;

  for (let i = 0; i < cartProducts.length; i++) {
    const priceText = cartProducts[i].querySelector(".cart-product-price").innerText.replace("$", "");
    const productPrice = parseFloat(priceText);
    const productQuantity = parseInt(cartProducts[i].querySelector(".product-qtd-input").value);

    totalAmount += productPrice * productQuantity;
  }

  document.querySelector(".cart-total-container span").innerText = "$" + totalAmount.toFixed(2);
}
