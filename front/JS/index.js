// Création de la page menu avec tous les produits disponibles affichés.
const products= async() => {
    fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then(r=>{
        let zoneItems=document.getElementById('items');
        zoneItems.innerHTML="";
        for (const key in r){
            // console.log(r[key].name)
            let lien=document.createElement("a")
            lien.setAttribute("href","./product.html?id="+r[key]._id)
            let article=document.createElement("article")
            let image=document.createElement("img")
            image.setAttribute("alt",r[key].altTxt)
            image.setAttribute("src",r[key].imageUrl)
            article.appendChild(image)
            let titre=document.createElement("h3")
            titre.classList.add("productName")
            titre.innerText=r[key].name
            article.appendChild(titre)
            let description=document.createElement("p")
            description.classList.add("productDescription")
            description.innerText=r[key].description
            article.appendChild(description)
            lien.appendChild(article)
            zoneItems.appendChild(lien)
        }     
    } ); 
} 
products()
