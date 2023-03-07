const url = new URL(document.location);
const orderId = url.searchParams.get("order");

const confirmation=document.getElementById("orderId")
confirmation.innerText=orderId