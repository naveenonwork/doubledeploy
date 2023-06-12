
var double_button_opener = document.getElementById('double_button_opener_container');

// Get value of single parameter

hasdemo=false;
var field = 'doubledemo';
var url = window.location.href;
if(url.indexOf('?' + field + '=') != -1)
  hasdemo= true;
else if(url.indexOf('&' + field + '=') != -1)
  hasdemo= true;

if(double_button_opener && hasdemo){
  var base_url = window.location.origin;
  
    product_id=double_button_opener.getAttribute('data-id')

  
    host=double_button_opener.getAttribute('data-host')
    //host_location="SHOPIFY_LOCATION_URL";
    host_location=double_button_opener.getAttribute('data-origin')
   const btn = document.createElement("BUTTON") 
    btn.addEventListener('click', function(event) {
 
      var selectedID = '';
      if(document.querySelector("select[name='id']")){
       selectedID = document.querySelector("select[name='id']").value; 
      }
      if(document.querySelector("input[name='id']")){
       selectedID = document.querySelector("input[name='id']").value; 
      }
      
      product_id=selectedID;
      // changed for last 9 number
      var productidstring =location.href;
      productidstring=productidstring.split('?')[0];
      productidstring=productidstring.substr(productidstring.length - 9);
      product_id=productidstring;
      let a= document.createElement('a');
      a.target= '_new';
      a.href= host_location+"/?host="+host+"&id="+product_id; 
      a.click();
      
    });   
  //  const btn  = document.createElement('a'); 
  //  btn.href =  host+"&id="+product_id; 
    
  //  btn.setAttribute("target", "_blank");
    btn.setAttribute("style","position: fixed;bottom: 25px;right: 25px;z-index:99999") ;
    btn.innerHTML = "3d View";
    btn.classList.add("btn");
  /*   btn.classList.add("btn--secondary-accent");
    btn.classList.add("btn--test"); */
   //double_button_opener.appendChild(btn);
   body=document.getElementsByTagName("BODY")[0]; 
   body.appendChild(btn);
  
}