const url = new URL(document.location);
const productId = url.searchParams.get("id");

// Configuration de la page produit et de ses informations.
const product= async() => {
    
    fetch('http://localhost:3000/api/products/'+productId)
    .then((response) => response.json())
    .then(r=>{
        let titre=document.getElementById("title")
        titre.innerText=r.name
        let prix=document.getElementById("price")
        prix.innerText=r.price
        let description=document.getElementById("description")
        description.innerText=r.description
        let color=document.getElementById("colors")
        let itemImg=document.querySelector(".item__img")
        let imgProduct=document.createElement("img")
        imgProduct.setAttribute("alt",r.altTxt)
        imgProduct.setAttribute("src",r.imageUrl)
        itemImg.appendChild(imgProduct)
        const sizeTableau = r.colors.length;
        for (let i = 0; i < sizeTableau ; i++) {  
            let optionContent=document.createElement("option")
            optionContent.value=r.colors[i]
            optionContent.innerText=r.colors[i]
            color.appendChild(optionContent)
        }
    } );
} 
product()

/*Action pour ajouter au panier*/
const buttonCart=document.getElementById("addToCart")

const addProductCart=(e)=>{
    const productQty=document.getElementById("quantity")
    const productColor=document.getElementById("colors")
    // console.log(productQty.value, productColor.value, productId)
    let cart={quantity:productQty.value,color:productColor.value,id:productId}
    let productCart=[];
    if(localStorage.getItem("panier")!=null){
        productCart=JSON.parse(localStorage.getItem("panier"))
    }
    if(productCart.length>0){
        // si existe produit dans le panier
        let ifModifCart=false
        for (const keyPP in productCart ) {
            if(productId==productCart[keyPP].id && productColor.value==productCart[keyPP].color){
                ifModifCart=true
                productCart[keyPP].quantity=parseInt(productQty.value)+parseInt(productCart[keyPP].quantity)
            }
        }
        if(ifModifCart==false){
            productCart.push(cart)
        }
    } else{
        productCart.push(cart)
    }
    localStorage.setItem("panier",JSON.stringify(productCart))
    // console.log(JSON.parse(localStorage.getItem("panier")))
}
buttonCart.addEventListener("click",addProductCart)