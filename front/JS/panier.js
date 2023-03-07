//  Événement de gestion du panier : addition ou réduction de quantité.

const changeProductCart=(e)=>{
    let el=e.currentTarget
    let parent=el.parentNode.parentNode.parentNode.parentNode
    //console.log(el.value,parent.dataset.id,parent.dataset.color)
    
    let productId=parent.dataset.id
    let productColor=parent.dataset.color
    let produitQty=el.value
    let productStore=JSON.parse(localStorage.getItem("panier"))
    for (const keyPP in productStore ){
        if(productId==productStore[keyPP].id && productColor==productStore[keyPP].color){
            productStore[keyPP].quantity=produitQty 
        }
    }
    localStorage.setItem("panier",JSON.stringify(productStore))
    // console.log(JSON.parse(localStorage.getItem("panier")))
    generateStore()
}

// Événement de gestion du panier : Supprimer le produit du panier.
const deleteProductCart=(e)=>{
    let el=e.currentTarget
    let parent=el.parentNode.parentNode.parentNode.parentNode
    let productId=parent.dataset.id
    let productColor=parent.dataset.color
    let productStore=JSON.parse(localStorage.getItem("panier"))
    productStore=productStore.filter((pp)=>!(pp.id==productId && pp.color==productColor))
    //console.log(productStore,produitId)
    
    localStorage.setItem("panier",JSON.stringify(productStore))
    // console.log(JSON.parse(localStorage.getItem("panier")))
    generateStore()
}

// Génère la page du panier et envoie les données des produits sélectionnés.
const generateStore=()=>{
    const cart =JSON.parse(localStorage.getItem("panier"))
    //console.log(panier);
    
    const cartItems=document.getElementById("cart__items")
    // vider la section cart__items
    cartItems.innerHTML=""
    let intTotalPrice=0
    let spanTotalPrice=document.getElementById("totalPrice")
    spanTotalPrice.innerText=intTotalPrice.toFixed(2)
    let intTotalQty=0
    let spanTotalQty=document.getElementById("totalQuantity")
    spanTotalQty.innerText=intTotalQty
    
    //console.log(panier)
    for (const key in cart) {
        // console.log(panier[key].id)
        const produitId=cart[key].id
        
        fetch('http://localhost:3000/api/products/'+produitId)
        .then((response) => response.json())
        .then(r=>{
            // console.log(r)
            // création de l'element article d'un produit
            let articleCartItem=document.createElement("article")
            articleCartItem.classList.add("cart__item")
            articleCartItem.dataset.id=produitId
            articleCartItem.dataset.color=cart[key].color
            
            // création de l'element image produit
            let divCartItemImg=document.createElement("div")
            divCartItemImg.classList.add("cart__item__img")
            
            // création de la balise img du produit et l'insérer dans "divCartItemImg"
            let imgProduit=document.createElement("img")
            imgProduit.setAttribute("alt",r.altTxt)
            imgProduit.setAttribute("src",r.imageUrl)
            divCartItemImg.appendChild(imgProduit)
            
            // création du contenu des information du produit
            let divCartItemContent=document.createElement("div")
            divCartItemContent.classList.add("cart__item__content")
            
            // création du contenu description du produit
            let divCartItemContentDescritption=document.createElement("div")
            divCartItemContentDescritption.classList.add("cart__item__content__description")
            
            // ajouter le titre, couleur et prix
            let titleProduct=document.createElement("h2")
            titleProduct.innerText=r.name
            let colorProduct=document.createElement("p")
            colorProduct.innerText=cart[key].color
            let priceProduct=document.createElement("prix")
            priceProduct.innerText=(r.price).toFixed(2)+" €"
            
            // création du contenu settings du produit
            let divCartItemContentSettings=document.createElement("div")
            divCartItemContentSettings.classList.add("cart__item__content__settings")
            
            // création de 2 div quantité et delete
            let divCartItemContentSettingsQty=document.createElement("div")
            divCartItemContentSettingsQty.classList.add("cart__item__content__settings__quantity")
            let divCartItemContentSettingsDel=document.createElement("div")
            divCartItemContentSettingsDel.classList.add("cart__item__content__settings__delete")
            
            // création des informations pour la quantité p et input
            let pQty=document.createElement("p")
            pQty.innerText="Qté : "
            let inputQty=document.createElement("input")
            inputQty.classList.add("itemQuantity")
            inputQty.setAttribute("name", "itemQuantity")
            inputQty.setAttribute("type", "number")
            inputQty.setAttribute("min", "1")
            inputQty.setAttribute("max", "100")
            inputQty.value=cart[key].quantity
            inputQty.addEventListener("change", changeProductCart)
            
            // création des informations pour le delete
            let pDel=document.createElement("p")
            pDel.classList.add("deleteItem")
            pDel.innerText="Supprimer"
            pDel.addEventListener("click", deleteProductCart)
            // calcul du total du panier
            intTotalPrice=intTotalPrice+(parseInt(r.price)*parseInt(cart[key].quantity))
            intTotalQty=intTotalQty+parseInt(cart[key].quantity)
            
            // console.log(intTotalPrice)
            
            // rendu du produit
            divCartItemContentSettingsDel.appendChild(pDel)
            divCartItemContentSettingsQty.appendChild(pQty)
            divCartItemContentSettingsQty.appendChild(inputQty)
            divCartItemContentSettings.appendChild(divCartItemContentSettingsQty)
            divCartItemContentSettings.appendChild(divCartItemContentSettingsDel)
            divCartItemContentDescritption.appendChild(titleProduct)
            divCartItemContentDescritption.appendChild(colorProduct)
            divCartItemContentDescritption.appendChild(priceProduct)
            divCartItemContent.appendChild(divCartItemContentDescritption)
            divCartItemContent.appendChild(divCartItemContentSettings)
            articleCartItem.appendChild(divCartItemContent)
            articleCartItem.appendChild(divCartItemImg)
            cartItems.appendChild(articleCartItem)
            
            // rendu du total du panier
            spanTotalPrice.innerText=intTotalPrice.toFixed(2)
            spanTotalQty.innerText=intTotalQty
        } );
    }
    
}

// Gestion du formulaire de commande 
const formConfirm =document.querySelector(".cart__order__form")
const validateEmail=(mail)=>{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(mail.match(mailformat))
    {
        return (true)
    }
    return (false)
}
const validate=(word)=>{
    var pattern =/^[a-zA-Z ]+$/ ;
    if(word.match(pattern))
    {
        return (true)
    }
    return (false)
}

// Envoie une requête à l'API et confirme que les informations saisies par le client sont correctes pour ensuite afficher le bon de commande
const confirmOrder=(e)=>{
    // console.log(e)
    e.preventDefault();
    let formValid= true
    let form =   e.currentTarget;
    let formData = new FormData(form);
    let contact = Object.fromEntries(formData)
    
    // Gestion des champs requis pour la validation de la commande
    if(!validate(contact.lastName)){
        formValid= false
        let lastNameError=document.getElementById("lastNameErrorMsg")
        lastNameError.innerHTML="Nom invalide"
    }
    if(!validate(contact.firstName)){
        formValid= false
        let firstNameError=document.getElementById("firstNameErrorMsg")
        firstNameError.innerHTML="Prénom invalide"
    }
    if(contact.address==''){
        formValid= false
        let addressError=document.getElementById("addressErrorMsg")
        addressError.innerHTML="Adresse invalide"
    }
    if(!validate(contact.city)){
        formValid= false
        let cityError=document.getElementById("cityErrorMsg")
        cityError.innerHTML="Ville invalide"
    }
    if(!validateEmail(contact.email)){
        formValid= false
        let emailError=document.getElementById("emailErrorMsg")
        emailError.innerHTML="E-mail invalide"
    }
    if(formValid){
        let productCart=JSON.parse(localStorage.getItem("panier"))
        let products=productCart.map((el)=>el.id)
        let orderDatas = {
            contact: contact,products:products
        }
        // console.log(orderDatas)
        fetch('http://localhost:3000/api/products/order',{
        method: "POST",
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(orderDatas)
    })
    .then((response) => response.json())
    .then(r=>{/*console.log(r)*/
    
    window.location.href = "/front/html/confirmation.html?order="+r.orderId;
});
} 
}

generateStore()

// Configuration du bouton commande
formConfirm.addEventListener("submit", confirmOrder)