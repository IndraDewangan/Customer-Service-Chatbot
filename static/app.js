
var totalItemsPurchased=0;
var totalAmount=0;
var orderTracking='';
var invoices=[];
var text2='';
class Chatbox{
    
    constructor(){
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }  
        
        this.state = false;
        this.message = [];
    }

   
    display(){
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', ()=>this.toggleState(chatBox));

        sendButton.addEventListener('click', ()=>this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key})=>{
            if(key==="Enter"){
                this.onSendButton(chatBox)
            }
        })

        displayButtons();
    }

    toggleState(chatbox){
        this.state = !this.state;

        if(this.state){
            chatbox.classList.add('chatbox--active')
        }else{
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox){
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if(text1===""){
            return;
        }
        

        let msg1 = {name: "user", message: text1}
        this.message.push(msg1);
        

        fetch('http://127.0.0.1:5000/predict',{
            method: 'POST',
            body: JSON.stringify({message:text1}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            //
            text2=r.answer;
            //
            let msg2 = {name: "Sam", message: r.answer };
            if(text1=="total cost"||text1=="how much?"||text1=="total amount"){
                msg2 = {name: "Sam", message: `Your total amount is ${totalAmount}` };
            }
            if(text1=="total items"||text1=="how many products are there in my cart"||text1=="how many products in my cart"||text1=="products in my cart"){
                msg2 = {name: "Sam", message: `Your total items are ${totalItemsPurchased}` };
            }            
            this.message.push(msg2);
            this.updateChatText(chatbox)
            textField.value=''
        }).catch((error)=>{
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value=''
        });
    }

        updateChatText(chatbox){
            var html ='';            
        
            if(text2=="download"){
                this.message.pop();
                if(!document.querySelector(".invoice")){
                    var msg2={name: "Sam", message: "You dont have current order bill , let me check if you have past order bill" };
                   
                    this.message.push(msg2);
                    
                    //
                    var emailid = document.querySelector(".logo").innerHTML;
                    fetch(`http://localhost:3000/getOrdersBills?email=${emailid}`, { 
                        method: 'GET', // Change to GET method
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        var order = data.orders;
                        var bill = data.bills
                        if(!bill){
                            var msg2={name: "Sam", message: "sorry you don't have past one also" };
                            this.message.push(msg2);
                            
                            //updatecall
                            document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/chatboxchatimage.png')";
                            document.querySelector(".chatbox__support").style.backgroundSize="90% 100%";
                            this.message.slice().reverse().forEach(function(item,number){
                            if(item.name==="Sam"){
                                html +='<div class="messages__item messages__item--visitor">' + item.message+'</div>'
                            }else{
                                html +='<div class="messages__item messages__item--operator">' + item.message+'</div>'
                        
                             }
                    
                            });
                            const chatmessage = chatbox.querySelector('.chatbox__messages');
                            chatmessage.innerHTML=html;
                        }else{
                            document.querySelector(".bill-header").style.display="none";
                            document.getElementById("prev").style.display="inline-block";
                            document.getElementById("next").style.display="inline-block";
                            document.querySelector(".prevNext").style.display="inline-block";
                            document.querySelector(".bill").innerHTML=bill;
                            var temp=document.querySelectorAll(".invoice");
                            temp.forEach((invoice, index) => {
                                invoices[index]=`<div class="invoice">${invoice.innerHTML}</div>`;
                            });
                            
                            document.querySelector(".bill").innerHTML=invoices[0];
                            var msg2={name: "Sam", message: "yes! you have, and loaded successfully" };
                            this.message.push(msg2);

                            //updatecall
                            document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/chatboxchatimage.png')";
                            document.querySelector(".chatbox__support").style.backgroundSize="90% 100%";
                            this.message.slice().reverse().forEach(function(item,number){
                            if(item.name==="Sam"){
                                html +='<div class="messages__item messages__item--visitor">' + item.message+'</div>'
                            }else{
                                html +='<div class="messages__item messages__item--operator">' + item.message+'</div>'
                            }
                    
                            });
                            const chatmessage = chatbox.querySelector('.chatbox__messages');
                            chatmessage.innerHTML=html;
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                    //

                }else{
                    var upload=false;
                    billDownload(upload);
                    var msg2={name: "Sam", message: "your invoice is downloaded" };
                    this.message.push(msg2);

                    document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/chatboxchatimage.png')";
                    document.querySelector(".chatbox__support").style.backgroundSize="90% 100%";
                    this.message.slice().reverse().forEach(function(item,number){
                    if(item.name==="Sam"){
                        html +='<div class="messages__item messages__item--visitor">' + item.message+'</div>'
                    }else{
                        html +='<div class="messages__item messages__item--operator">' + item.message+'</div>'
                    }
                    
                });
                const chatmessage = chatbox.querySelector('.chatbox__messages');
                chatmessage.innerHTML=html;     
                }
                return;

            }
            if(text2==='invoice'){
                this.message.pop();
                var emailid = document.querySelector(".logo").innerHTML;
                    fetch(`http://localhost:3000/getOrdersBills?email=${emailid}`, { 
                        method: 'GET', // Change to GET method
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        var order = data.orders;
                        var bill = data.bills
                        if(!bill){
                            var msg2={name: "Sam", message: "No invoice available" };
                            this.message.push(msg2);

                            //update
                            document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/chatboxchatimage.png')";
                            document.querySelector(".chatbox__support").style.backgroundSize="90% 100%";
                            this.message.slice().reverse().forEach(function(item,number){
                            if(item.name==="Sam"){
                                html +='<div class="messages__item messages__item--visitor">' + item.message+'</div>'
                            }else{
                                html +='<div class="messages__item messages__item--operator">' + item.message+'</div>'
                            }
                            
                        });
                        const chatmessage = chatbox.querySelector('.chatbox__messages');
                        chatmessage.innerHTML=html;              
                        }else{
                            document.querySelector(".bill-header").style.display="none";
                            document.getElementById("prev").style.display="inline-block";
                            document.getElementById("next").style.display="inline-block";
                            document.querySelector(".prevNext").style.display="inline-block";
                            document.querySelector(".bill").innerHTML=bill;
                            var temp=document.querySelectorAll(".invoice");
                            temp.forEach((invoice, index) => {
                                invoices[index]=`<div class="invoice">${invoice.innerHTML}</div>`;
                            });
                            
                            document.querySelector(".bill").innerHTML=invoices[0];
                            var msg2={name: "Sam", message: "Invoice loaded successfully" };
                            this.message.push(msg2);

                            document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/chatboxchatimage.png')";
                            document.querySelector(".chatbox__support").style.backgroundSize="90% 100%";
                        this.message.slice().reverse().forEach(function(item,number){
                            if(item.name==="Sam"){
                                html +='<div class="messages__item messages__item--visitor">' + item.message+'</div>'
                            }else{
                                html +='<div class="messages__item messages__item--operator">' + item.message+'</div>'
                            }
                            
                        });
                        const chatmessage = chatbox.querySelector('.chatbox__messages');
                        chatmessage.innerHTML=html;
                        }

                       
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                return;
            }
            
            if(text2==="order"){
                this.message = [];
                chatbox.querySelector('.chatbox__messages').innerHTML='';
                document.getElementById("purchasedItems").innerHTML='';
                    //
                    var emailid = document.querySelector(".logo").innerHTML;
                    fetch(`http://localhost:3000/getOrdersBills?email=${emailid}`, { 
                        method: 'GET', // Change to GET method
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        var order = data.orders;
                        var bill = data.bills
                        if(!order){
                            document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/noOrder.jpg')";
                            document.querySelector(".chatbox__support").style.backgroundSize="100% 100%";
                        }else{
                            document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/ordered.jpg')";
                            document.querySelector(".chatbox__support").style.backgroundSize="100% 100%";
                            document.getElementById("purchasedItems").innerHTML=order;
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                    //
                return;
            }
            if(text2==="cart"){
                this.message = [];
                chatbox.querySelector('.chatbox__messages').innerHTML='';
                document.getElementById("purchasedItems").innerHTML='';
                if(cart.size==0){
                    document.getElementById("purchasedItems").innerHTML =`<div style='color:yellow; text-shadow: -3px 0 black, 0 3px black, 3px 0 black, 0 -3px black; font-size:50px'>Your cart is empty</div>`;
                    document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/emptyCart.png')";
                    document.querySelector(".chatbox__support").style.backgroundSize="100% 100%";
                    
                }else{
                    document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/filledCart.png')";
                    document.querySelector(".chatbox__support").style.backgroundSize="100% 100%";
                    for (let [key, freq] of cart){
                        product.map((item)=>{
                            var {id, image, title, price} = item;
                            if(id==key){
                                document.getElementById("purchasedItems").innerHTML +=`<div class='cart-item'>
                                                                                            <div class='row-img'>
                                                                                                <img class='rowimg' src=${image}>
                                                                                            </div>
                                                                                            <p style='font-size:12px;'>${title}</p>
                                                                                            <h5>${freq} pcs</h5><h4 style="color:red">$ ${price*freq}</h4>
                                                                                        </div>`
                            }
                            
                        }).join('');
                    }
                }
                return;
                
            }else{
                document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/chatboxchatimage.png')";
                    document.querySelector(".chatbox__support").style.backgroundSize="90% 100%";
                this.message.slice().reverse().forEach(function(item,number){
                    if(item.name==="Sam"){
                        html +='<div class="messages__item messages__item--visitor">' + item.message+'</div>'
                    }else{
                        html +='<div class="messages__item messages__item--operator">' + item.message+'</div>'
                    }
                    
                });
                const chatmessage = chatbox.querySelector('.chatbox__messages');
                chatmessage.innerHTML=html;
            }      

        }
}

var totalItemsPurchased=0;
const chatbox = new Chatbox();
chatbox.display();


document.querySelector(".chatbox__support").style.backgroundImage = "url('/static/images/chatboxchatimage.png')";
document.querySelector(".chatbox__support").style.backgroundSize="90% 100%";

//extra

const product = [
    {
        id: 0,
        image: '/static/images/gg-1.jpg',
        title: 'Z Flip Foldable Mobile',
        price: 120,
    },
    {
        id: 1,
        image: '/static/images/hh-2.jpg',
        title: 'Air Pods Pro',
        price: 60,
    },
    {
        id: 2,
        image: '/static/images/ee-3.jpg',
        title: '250D DSLR Camera',
        price: 230,
    },
    {
        id: 3,
        image: '/static/images/aa-1.jpg',
        title: 'Head Phones',
        price: 100,
    },
    {
        id: 4,
        image: '/static/images/5.webp',
        title: 'iphone 15',
        price: 450,
    },
    {
        id: 5,
        image: '/static/images/6.webp',
        title: 'SAMSUNG Galaxy A14 5G',
        price: 200,
    },
    {
        id: 6,
        image: '/static/images/7.webp',
        title: 'Mi Basic Wired Headset with Mic',
        price: 20,
    },
    {
        id: 7,
        image: '/static/images/8.webp',
        title: 'realme Buds T300 12.4mm Driver',
        price: 30,
    },
    {
        id: 8,
        image: '/static/images/9.webp',
        title: 'XElectron (32 inch) HD Ready 3D LED TV ',
        price: 300,
    },
    {
        id: 9,
        image: '/static/images/10.webp',
        title: 'Voltas Beko 7 kg Fully Automatic Top Load Washing Machine',
        price: 130,
    }
];
const categories = [...new Set(product.map((item)=>
    {return item}))]
    let i=0;
document.getElementById('root').innerHTML = categories.map((item)=>
{
    var {id,image, title, price} = item;
    return(
        `<div class='box'>
            <div class='img-box'>
                <img class='images' src=${image}></img>
            </div>
        <div class='bottom'>
        <p>${title}</p>
        <h2>$ ${price}.00</h2>`+
        `<button class='Cartbutton' onclick='addtocart(${id},this)'>Add to cart</button>`+
        `</div>
        </div>`
    )
}).join('')

var cart =new Map();
var buttons = new Map();

function addtocart(id,button){
    buttons.set(id,button);
    button.textContent = "Added to cart";
    button.disabled= true;
    buttons.get(id).classList.add("CartbuttonOpacity");
    if(cart.has(id)){
        cart.set(id,cart.get(id)+1);
    }
    else{
        cart.set(id,1);
    }
    displaycart();
}
function delElement(id){
    if(cart.get(id)==1){
        buttons.get(id).textContent = "Add to cart";
        buttons.get(id).disabled= false;
        buttons.get(id).classList.remove("CartbuttonOpacity");
        cart.set(id,0);
        cart.delete(id);
    }else{
        cart.set(id,cart.get(id)-1);
    }
    displaycart();
}

function addtocartIncrease(id){
    if(cart.has(id)){
        cart.set(id,cart.get(id)+1);
    }
    else{
        cart.set(id,1);
    }
    displaycart();
}

function displaycart(){
    orderTracking='';
    document.getElementById("cartItem").innerHTML='';
    var total=0,count=0;
    if(cart.size==0){
        document.getElementById("count").innerHTML=0;
        document.getElementById('cartItem').innerHTML = "Your cart is empty";
        document.getElementById("total").innerHTML = "$ "+0+".00";
    }else{
        for (let [key, freq] of cart){
            product.map((item)=>{
                var {id, image, title, price} = item;
                if(id==key){
                    total=total+(price*freq);
                    count+=freq;
                    document.getElementById("count").innerHTML=count;
                    document.getElementById("total").innerHTML = "$ "+total+".00";
                    document.getElementById("cartItem").innerHTML +=`<div class='cart-item'>
                                                                        <div class='row-img'>
                                                                            <img class='rowimg' src=${image}>
                                                                        </div>
                                                                        <p style='font-size:12px;'>${title}</p>
                                                                        <h2 style='font-size: 15px;'>$ ${price}.00</h2>
                                                                        <button onclick='delElement(${id})' class='decQuant'>-</button>
                                                                        <span>${freq}</span>
                                                                        <button onclick='addtocartIncrease(${id})' class='decQuant'>+</button><h2 style="color:red">${price*freq}</h2></div>`
                    
                    orderTracking =`<div class='cart-item'><div class='row-img'><img class='rowimg' src=${image}></div><p style='font-size:12px;'>${title}</p><h6>${freq} pcs</h6> <h2 style="color:red">$ ${price*freq}</h2></div>`+ orderTracking;
                }
                
            }).join('');
        }
        totalItemsPurchased=count;
        totalAmount=total;

    }

    
}
function mainDissapear(){
    document.getElementById("main").classList.add('main');
}




//modal 1

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
    if(cart.size==0){
        document.getElementById("cartItem").innerHTML="your cart is empty!";
    }
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
// open modal event
openModalBtn.addEventListener("click", openModal);

//modal 2

const modal1 = document.querySelector(".modal1");
const overlay1 = document.querySelector(".overlay1");
const openModalBtn1 = document.querySelector(".checkout-open");
const closeModalBtn1 = document.querySelector(".btn-close1");

// close modal function
const closeModal1 = function () {
    document.querySelector(".pay-btn").innerHTML="PAY";
    document.querySelector(".pay-btn").style.background="#581B98";
    // document.querySelector(".submit-btn").style.display='none';
  modal1.classList.add("hidden1");
  overlay1.classList.add("hidden1");
};

// close the modal when the close button and overlay is clicked
closeModalBtn1.addEventListener("click", closeModal1);
overlay1.addEventListener("click", closeModal1);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal1.classList.contains("hidden1")) {
    closeModal1();
  }
});

// open modal function
const openModal1 = function () {
    if(cart.size==0){
        document.getElementById("cartItem").innerHTML="You do no have any item in your cart to proceed for checkout. Please add atleast one item in your cart !!";
        document.getElementById("cartItem").style.color="#581B98";
        document.getElementById("cartItem").style.fontSize="30px";
    }else{
        closeModal();
        modal1.classList.remove("hidden1");
        overlay1.classList.remove("hidden1");
    }
};
// open modal event
openModalBtn1.addEventListener("click", openModal1);

//payment
var payment=false;
// document.querySelector(".submit-btn").style.display='none';
// var buttonStack=new Map();


function displayButtons(){
    document.getElementById("whatsappStack").innerHTML=''; 

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Get the key at index i
        const value = localStorage.getItem(key); // Get the corresponding value
        if(key!=='0'){
            document.getElementById("whatsappStack").innerHTML += value;
        }
    }
    
}

async function pay(){
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    var name=document.querySelector(".name").value;
    var email=document.querySelector(".email").value;
    var address=document.querySelector(".address").value;
    var number=document.querySelector(".number").value;
    var city=document.querySelector(".city").value;
    var state=document.querySelector(".state").value;
    var code=document.querySelector(".code").value;

    var total=0;
    var sub_invoice_element='';
    for (let [key, freq] of cart){
        product.map((item)=>{
            var {id, image, title, price} = item;
            if(id==key){
                total=total+(price*freq);
                sub_invoice_element +=`<div class="i_row">
                                            <div class="i_col w_15">
                                            <p>${freq}</p>
                                            </div>
                                            <div class="i_col w_55">
                                            <p>${title}.</p>                                                                    
                                            </div>
                                            <div class="i_col w_15">
                                            <p>$${price}</p>
                                            </div>
                                            <div class="i_col w_15">
                                            <p>$${freq*price}</p>
                                            </div>
                                        </div>`;

            }
        });
    }
    
    //
     var invoice_element =`<div class="invoice"><div class="bl-header"><div class="i_row"><div class="i_logo">Name    : ${name}</div><div class="i_logo">Email   : ${email}</div><div class="i_logo">Address : ${address}</div><div class="i_logo">Mob no. : ${number}</div></div><div class="i_title"><h2>INVOICE</h2> <h4>${formattedDate}</h4></div></div><div class="bl-body"><div class="i_table"><div class="i_table_head"><div class="i_row"><div class="i_col w_15"><p class="p_title">QTY</p></div><div class="i_col w_55"><p class="p_title">PRODUCT</p></div><div class="i_col w_15"><p class="p_title">PRICE</p></div><div class="i_col w_15"><p class="p_title">TOTAL</p></div></div></div><div class="i_table_body">${sub_invoice_element}</div><div class="i_table_foot"><div class="i_row grand_total_wrap"><div class="i_col w_50"><p class="p_title">Payment Method</p><p>Card</p></div><div class="i_col w_50"></div><div class="i_col w_50 grand_total">Total $${total}</div></div></div></div></div></div>`
    //
    // document.querySelector(".chatbox__support").style.backgroundImage = "none";
    
    // document.getElementById("purchasedItems").innerHTML=document.querySelector(".bill").innerHTML;

    var url="(`https://wa.me/+91"+number+"?text="
    +"name : " +name+"%0a"
    +"email : " +email+"%0a"
    +"address : " +address+"%0a"
    +"number : " +number+"%0a"
    +"city : " +city+"%0a"
    +"state : " +state+"%0a"
    +"code : " +code+"%0a%0a"
    +"invoice : your order of "+ totalAmount+" Rs. payment is successfully done%0a`)";
    
    //
    if(!localStorage.getItem('0')){
        localStorage.setItem('0','1');
    }else{
        var int=parseInt(localStorage.getItem('0'));
        int=int+1;
        localStorage.setItem('0',int);
    }
    var x=localStorage.getItem('0');
    
    var value=`<button type='button' onclick='sendWhatsapp(${url},${x})' class='submit-btn'>send bill via whatsapp to ${name}</button>`;
    localStorage.setItem(x,value);
    //

    document.querySelector(".pay-btn").innerHTML="Payment Successfully Done";
    document.querySelector(".pay-btn").style.background="#2ecc71";
    //order save in database
    var emailid = document.querySelector(".logo").innerHTML;
    var orders='';
    var bills='';

    fetch(`http://localhost:3000/getOrdersBills?email=${emailid}`, { 
                        method: 'GET', // Change to GET method
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        var order = data.orders;
                        var bill = data.bills;

                        if(!order){
                           orders=orderTracking+`<div style="font-size: 20px; background-color: #581B98; color:white; height: 40px;">ORDER DATE : ${formattedDate}</div>`;
                        }else{
                            orders=orderTracking+`<div style="font-size: 20px; background-color: #581B98; color:white; height: 40px;">ORDER DATE : ${formattedDate}</div>`+order;
                        }
                        if(!bill){
                            bills=invoice_element;
                        }else{
                            bills=invoice_element+bill;
                        }
                        fetch('http://localhost:3000/ordersBills',{
                            method: 'POST',
                            body: JSON.stringify({order:orders,bill:bills,email:emailid}),
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        })
                        .then(r => r.json())
                        .then(r => {
                        }).catch((error)=>{
                            console.error('Error:', error);
                        });
                        //
                        displayButtons();
                        setTimeout(() => {
                            closeModal1();
                        }, 1000);

                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
//after order only order bill generate and update stuffs
document.querySelector(".bill").innerHTML=invoice_element;
document.querySelector(".bill-header").style.display="none";

//download bill
await billDownload(true,number,totalAmount,);
                            

}
//sendWhatapp

function sendWhatsapp(url,a){

    // document.querySelector(".pay-btn").innerHTML="PAY DONE";
    // document.querySelector(".submit-btn").style.display='none';

    window.open(url,'_blank').focus();
    localStorage.removeItem(a);
    displayButtons();
}

//prev and next button
let currentIndex = 0; 
function displayElement() {
    document.querySelector(".bill").innerHTML = invoices[currentIndex];
    document.querySelector(".prevNext").innerHTML=` ${currentIndex+1}`;
    if(currentIndex===0){
        document.getElementById("prev").style.opacity = "0.5";
    }
    if(currentIndex===invoices.length-1){
        document.getElementById("next").style.opacity = "0.5";
    }
  }
  
  // Event listeners for the buttons
  document.getElementById("prev").addEventListener("click", () => {
    if (currentIndex > 0) {
        document.getElementById("next").style.opacity = "1";
      currentIndex--; // Move to the previous element
      displayElement();
    }
  });
  
  document.getElementById("next").addEventListener("click", () => {
    if (currentIndex < invoices.length - 1) {
        document.getElementById("prev").style.opacity = "1";
      currentIndex++; // Move to the next element
      displayElement();
    }
  });

//   bill download function

async function billDownload(upload,number,amount){
    const displayElement = document.querySelector(".invoice");
    html2canvas(displayElement).then((canvas) => {
        if(upload==true){
            imageUrl = uploadCanvasToCloudinary(canvas,number,amount);
        }
      // Create a link element
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png"); // Set the image format to PNG
      link.download = "downloaded-image.png"; // Set the download file name
      link.click(); // Trigger the download
    });
}

// Convert the canvas to a blob and upload to Cloudinary
async function uploadCanvasToCloudinary(canvas,number,amount) {
    // Convert canvas to a blob
    canvas.toBlob(async (blob) => {
      // Prepare form data for the upload
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "bill_whatsapp"); // Replace with your Cloudinary preset
  
      // Make the upload request to Cloudinary
      const response = await fetch("https://api.cloudinary.com/v1_1/dxewpomm4/image/upload", {
        method: "POST",
        body: formData,
      });
  
      // Get the URL of the uploaded image
      const data = await response.json();
      imageUrl = data.secure_url; // This is the public URL of the image
      const publicId = data.public_id;
  
      console.log("public id is :", publicId);
      // You can now use imageUrl to display or send the image

      await fetch('http://localhost:3000/send-whatsapp',{
        method: 'POST',
        body: JSON.stringify({to:`+91${number}`,message:`Dear Customer,\n\nThank you for choosing our services.\nThe payment of $ ${totalAmount} has been completed.\nWe appreciate your trust in us and look forward to serving you again.\n\nBest regards,\nJarvis`,url:imageUrl,id:publicId}),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(r => r.json())
    .then(r => {
    }).catch((error)=>{
        console.error('Error:', error);
    });
    });
  }

  