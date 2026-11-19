"use strict";
/* ---------- Countries & fallback rates (1 USD = rate local) ---------- */
const COUNTRIES = [
  ["KE","Kenya","KES",129],["NG","Nigeria","NGN",1550],["GH","Ghana","GHS",15.5],["UG","Uganda","UGX",3650],
  ["TZ","Tanzania","TZS",2650],["RW","Rwanda","RWF",1420],["ET","Ethiopia","ETB",125],["ZA","South Africa","ZAR",18.2],
  ["EG","Egypt","EGP",49],["MA","Morocco","MAD",9.9],["SN","Senegal","XOF",610],["CI","Côte d'Ivoire","XOF",610],
  ["US","United States","USD",1],["CA","Canada","CAD",1.38],["MX","Mexico","MXN",18.5],["BR","Brazil","BRL",5.4],
  ["GB","United Kingdom","GBP",0.78],["DE","Germany","EUR",0.92],["FR","France","EUR",0.92],["IT","Italy","EUR",0.92],
  ["ES","Spain","EUR",0.92],["AE","UAE","AED",3.67],["SA","Saudi Arabia","SAR",3.75],["IN","India","INR",84],
  ["PK","Pakistan","PKR",278],["BD","Bangladesh","BDT",120],["CN","China","CNY",7.2],["JP","Japan","JPY",150],
  ["KR","South Korea","KRW",1370],["ID","Indonesia","IDR",15800],["PH","Philippines","PHP",58],["AU","Australia","AUD",1.52]
].map(([code,name,cur,rate])=>({code,name,cur,rate}));

/* ---------- Products: [name, category, priceUSD, emoji] ---------- */
const CATS = ["Phones & Tablets","Computers","Electronics","Fashion","Shoes","Home & Kitchen","Appliances","Beauty","Health","Groceries","Baby & Kids","Sports","Gaming","Automotive","Books & Office","Garden & Tools"];
const RAW = [
 ["Smartphone 128GB","Phones & Tablets",189,"📱"],["Android Tablet 10\"","Phones & Tablets",149,"📲"],["Phone Case & Screen Guard","Phones & Tablets",9,"📱"],["Power Bank 20,000mAh","Phones & Tablets",22,"🔋"],
 ["Laptop 15.6\" Core i5","Computers",420,"💻"],["Wireless Mouse","Computers",12,"🖱️"],["Mechanical Keyboard","Computers",45,"⌨️"],["Flash Drive 128GB","Computers",11,"💾"],
 ["Bluetooth Earbuds","Electronics",25,"🎧"],["Smart TV 43\" 4K","Electronics",260,"📺"],["Bluetooth Speaker","Electronics",30,"🔊"],["Smart Watch","Electronics",39,"⌚"],["Digital Camera","Electronics",310,"📷"],
 ["Men's Casual Shirt","Fashion",16,"👕"],["Women's Summer Dress","Fashion",24,"👗"],["Denim Jeans","Fashion",28,"👖"],["Leather Handbag","Fashion",35,"👜"],["Sunglasses","Fashion",14,"🕶️"],["Winter Jacket","Fashion",48,"🧥"],
 ["Running Sneakers","Shoes",42,"👟"],["Leather Formal Shoes","Shoes",55,"👞"],["Women's Heels","Shoes",38,"👠"],["Sandals","Shoes",15,"🩴"],
 ["Non-stick Cooking Pot Set","Home & Kitchen",44,"🍳"],["Dinner Set 24pc","Home & Kitchen",36,"🍽️"],["Bed Sheet Set","Home & Kitchen",27,"🛏️"],["Table Lamp","Home & Kitchen",19,"💡"],
 ["Microwave Oven 20L","Appliances",95,"♨️"],["Electric Kettle","Appliances",18,"☕"],["Blender 1.5L","Appliances",32,"🥤"],["Refrigerator 200L","Appliances",280,"🧊"],["Washing Machine 7kg","Appliances",330,"🧺"],["Standing Fan","Appliances",29,"🌀"],
 ["Perfume 100ml","Beauty",26,"🧴"],["Lipstick Set","Beauty",13,"💄"],["Hair Dryer","Beauty",21,"💇"],["Skin Care Kit","Beauty",34,"🧼"],
 ["Vitamin C Tablets","Health",10,"💊"],["Digital Thermometer","Health",8,"🌡️"],["Blood Pressure Monitor","Health",28,"🩺"],
 ["Rice 5kg","Groceries",9,"🍚"],["Cooking Oil 3L","Groceries",8,"🫒"],["Coffee 500g","Groceries",12,"☕"],["Fresh Fruit Box","Groceries",15,"🍎"],
 ["Baby Diapers Pack","Baby & Kids",17,"🍼"],["Kids Toy Car","Baby & Kids",9,"🚗"],["School Backpack","Baby & Kids",18,"🎒"],["Baby Stroller","Baby & Kids",85,"👶"],
 ["Football","Sports",14,"⚽"],["Yoga Mat","Sports",16,"🧘"],["Dumbbell Set 20kg","Sports",40,"🏋️"],["Mountain Bike","Sports",190,"🚲"],
 ["Game Console","Gaming",340,"🎮"],["Wireless Controller","Gaming",39,"🕹️"],["Gaming Headset","Gaming",33,"🎧"],
 ["Car Phone Holder","Automotive",8,"🚘"],["Car Vacuum Cleaner","Automotive",23,"🧹"],["Motor Oil 4L","Automotive",31,"🛢️"],
 ["Notebook Set (5)","Books & Office",7,"📓"],["Office Chair","Books & Office",75,"🪑"],["Bestseller Novel","Books & Office",11,"📚"],
 ["Cordless Drill","Garden & Tools",52,"🔧"],["Garden Hose 20m","Garden & Tools",20,"🌿"],["Tool Kit 100pc","Garden & Tools",37,"🧰"]
];
const PRODUCTS = RAW.map(([name,cat,usd,emoji],i)=>({
  id:i+1,name,cat,usd,emoji,
  rating:3.6+((i*7)%14)/10,
  reviews:20+((i*53)%480),
  off:i%3===0?10+(i*5)%30:0
}));

/* ---------- State ---------- */
const $ = s=>document.querySelector(s);
const store = {get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
let rates = store.get("tt_rates",{});
let state = {cc:store.get("tt_cc",null),cart:store.get("tt_cart",{}),cat:"All",q:"",sort:"pop"};

const country = ()=>COUNTRIES.find(c=>c.code===state.cc)||COUNTRIES.find(c=>c.code==="US");
const rate = ()=>rates[country().cur]||country().rate;
const price = usd=>{
  const c=country().cur, v=usd*rate();
  const d=["JPY","KRW","UGX","TZS","RWF","XOF","IDR","NGN"].includes(c)?0:2;
  try{return new Intl.NumberFormat(undefined,{style:"currency",currency:c,maximumFractionDigits:d,minimumFractionDigits:d}).format(v)}
  catch{return c+" "+v.toFixed(d)}
};
const usd = n=>"US$ "+n.toFixed(2);

/* ---------- Detect country & live rates ---------- */
function detect(){
  if(state.cc) return;
  const region=(navigator.languages||[navigator.language]).map(l=>(l||"").split("-")[1]).find(Boolean);
  state.cc=COUNTRIES.some(c=>c.code===region?.toUpperCase())?region.toUpperCase():"US";
}
async function liveRates(){
  try{
    const r=await fetch("https://open.er-api.com/v6/latest/USD");
    const j=await r.json();
    if(j.rates){rates=j.rates;store.set("tt_rates",rates);renderAll()}
  }catch{/* offline: fallback rates stay in use */}
}

/* ---------- Rendering ---------- */
const stars=r=>{const f=Math.round(r);return "★".repeat(f)+"<i>"+"★".repeat(5-f)+"</i>"};
function visible(){
  let l=PRODUCTS.filter(p=>(state.cat==="All"||p.cat===state.cat)&&(p.name+" "+p.cat).toLowerCase().includes(state.q.toLowerCase()));
  const eff=p=>p.usd*(1-p.off/100);
  if(state.sort==="low")l.sort((a,b)=>eff(a)-eff(b));
  if(state.sort==="high")l.sort((a,b)=>eff(b)-eff(a));
  if(state.sort==="rate")l.sort((a,b)=>b.rating-a.rating);
  return l;
}
function renderGrid(){
  const l=visible();
  $("#title").textContent=(state.cat==="All"?"All products":state.cat)+" ("+l.length+")";
  $("#empty").hidden=l.length>0;
  $("#grid").innerHTML=l.map(p=>{
    const now=p.usd*(1-p.off/100);
    return `<article class="card">
      ${p.off?`<span class="off">-${p.off}%</span>`:""}
      <div class="pic" aria-hidden="true">${p.emoji}</div>
      <h3>${p.name}</h3>
      <div class="stars" aria-label="${p.rating.toFixed(1)} out of 5">${stars(p.rating)} <small>(${p.reviews})</small></div>
      <div class="price">${price(now)}</div>
      ${p.off?`<div class="old">${price(p.usd)}</div>`:""}
      <button class="add" data-add="${p.id}">Add to cart</button></article>`}).join("");
}
function renderNav(){
  const all=["All",...CATS];
  $("#chips").innerHTML=all.map(c=>`<button role="tab" aria-selected="${c===state.cat}" data-cat="${c}">${c}</button>`).join("");
  $("#catList").innerHTML=all.map(c=>`<li><button data-cat="${c}">${c==="All"?"All products":c}<span>${c==="All"?PRODUCTS.length:PRODUCTS.filter(p=>p.cat===c).length}</span></button></li>`).join("");
}
function cartTotals(){
  let sub=0,n=0;
  for(const [id,q] of Object.entries(state.cart)){const p=PRODUCTS.find(x=>x.id==id);if(p){sub+=p.usd*(1-p.off/100)*q;n+=q}}
  const ship=sub===0||sub>=50?0:4.99;
  return {sub,ship,total:sub+ship,n};
}
function renderCart(){
  const t=cartTotals();
  $("#cartCount").textContent=t.n;
  const items=Object.entries(state.cart).map(([id,q])=>[PRODUCTS.find(x=>x.id==id),q]).filter(([p])=>p);
  $("#cartItems").innerHTML=items.length?items.map(([p,q])=>`<div class="line">
    <div class="e">${p.emoji}</div>
    <div><div>${p.name}</div><small>${price(p.usd*(1-p.off/100))}</small>
      <div class="qty"><button data-dec="${p.id}" aria-label="Decrease">−</button><span>${q}</span><button data-inc="${p.id}" aria-label="Increase">+</button></div></div>
    <button class="rm" data-rm="${p.id}">Remove</button></div>`).join(""):`<p class="empty">Your cart is empty. Add something you like.</p>`;
  $("#subtotal").textContent=price(t.sub);
  $("#delivery").textContent=t.ship?price(t.ship):"Free";
  $("#total").textContent=price(t.total);
  $("#usdNote").textContent=state.cc==="US"?"":`Base price ${usd(t.total)}`;
  store.set("tt_cart",state.cart);
}
function renderRate(){
  const c=country();
  $("#rateBox").innerHTML=`Shopping from ${c.name}<b>US$ 1 = ${rate().toLocaleString(undefined,{maximumFractionDigits:2})} ${c.cur}</b>`;
}
function renderAll(){renderRate();renderGrid();renderCart()}

/* ---------- Actions ---------- */
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),1800)}
function panel(el,open){
  ["#catMenu","#cart"].forEach(s=>$(s).classList.remove("open"));
  if(open)$(el).classList.add("open");
  $("#scrim").classList.toggle("on",!!open);
  $("#catBtn").setAttribute("aria-expanded",el==="#catMenu"&&open);
}
function setCat(c){state.cat=c;renderNav();renderGrid();panel(null,false);$("#chips").scrollIntoView({behavior:"smooth",block:"start"})}
function change(id,d){
  const q=(state.cart[id]||0)+d;
  if(q<=0)delete state.cart[id];else state.cart[id]=q;
  renderCart();
}

document.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.add){change(b.dataset.add,1);toast("Added to cart")}
  else if(b.dataset.inc)change(b.dataset.inc,1);
  else if(b.dataset.dec)change(b.dataset.dec,-1);
  else if(b.dataset.rm)change(b.dataset.rm,-9999);
  else if(b.dataset.cat)setCat(b.dataset.cat);
  else if(b.hasAttribute("data-close"))panel(null,false);
});
$("#catBtn").onclick=()=>panel("#catMenu",true);
$("#cartBtn").onclick=()=>panel("#cart",true);
$("#scrim").onclick=()=>panel(null,false);
document.addEventListener("keydown",e=>{if(e.key==="Escape")panel(null,false)});
$("#shopNow").onclick=()=>setCat("All");
$("#searchForm").onsubmit=e=>{e.preventDefault();state.q=$("#search").value.trim();state.cat="All";renderNav();renderGrid()};
$("#search").oninput=e=>{state.q=e.target.value.trim();renderGrid()};
$("#sort").onchange=e=>{state.sort=e.target.value;renderGrid()};
$("#country").onchange=e=>{state.cc=e.target.value;store.set("tt_cc",state.cc);renderAll();toast("Prices now in "+country().cur)};

$("#checkout").onclick=()=>{
  const t=cartTotals();
  if(!t.n)return toast("Your cart is empty");
  $("#orderSum").textContent=`${t.n} item(s) · Total ${price(t.total)} · Delivering to ${country().name}`;
  $("#orderDlg").showModal();
};
$("#cancelOrder").onclick=()=>$("#orderDlg").close();
$("#orderForm").onsubmit=()=>{
  const ref="TST-"+Math.random().toString(36).slice(2,8).toUpperCase();
  state.cart={};renderCart();panel(null,false);
  toast("Order "+ref+" placed. Thank you!");
};

/* ---------- Init ---------- */
detect();
$("#country").innerHTML=COUNTRIES.map(c=>`<option value="${c.code}">${c.name} (${c.cur})</option>`).join("");
$("#country").value=state.cc;
renderNav();renderAll();liveRates();
