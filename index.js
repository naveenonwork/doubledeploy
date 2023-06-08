// @ts-check
import { join } from "path";
import {  readFile, writeFile,readFileSync } from "fs";
import fs from 'fs';
import express from "express";
import serveStatic from "serve-static";
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from 'mongodb';
import  mongo from 'mongodb';
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import fileupload from "express-fileupload";
import  fetch    from   "node-fetch" ;
import  FormData  from  "form-data";
import  http  from  "https";
import  path  from  "path"; 
import fileUpload from "express-fileupload";
 
 

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);
const MongoPath =  process.env.NODE_ENV === "production"
? process.env.MONGODB_URI: "mongodb://localhost" ;
const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend`;


const app = express();
const cwd=process.cwd(); 
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(fileupload({
  useTempFiles: true,
  safeFileNames: true,
  preserveExtension: true,
  tempFileDir: '/tmp/'
})); 
//app.use(express.static('public'));
app.use(express.static(STATIC_PATH));

app.get("/api/products/count", async (_req, res) => {
 
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });

  res.status(200).send(countData);
});
 
app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.get("/api/settings/get", async (_req, res) => {
  const unique_session_id = uuidv4();
  //generate uniquetoken id 
  const shopify_session=res.locals.shopify.session;
   
  let mongoClient;
  let settings;
  let jsurl='';
  try {
      mongoClient = await connectToDatabse(MongoPath);
      const db = mongoClient.db('double');
      const collection = db.collection('settings');
      settings=  await findSettingsByShop(collection,res.locals.shopify.session.shop);
      
  } finally {
      await mongoClient.close();
  }  

  const result={session:res.locals.shopify.session,
    settings:settings 
    
  };
  res.status(200).send(result);
   
});
app.get("/static/glb/:glbfile",   async  (req, res) => {
  
  var filePath=cwd +'/public/glbs/'+req.params.glbfile ;
  res.writeHead(200, {'Content-Type': 'model/gltf-binary'});

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res); 
  //model/gltf-binary
})

app.get("/static/script/:jsfile",   async  (req, res) => {
   var referer=req.headers.referer;
  var filePath=cwd +'/public/'+req.params.jsfile ;
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res); 
  
})

app.get("/static/js/:id/:jsfile",   async  (req, res) => {
  let mongoClient;
  let settings;
  let count;
  var referer=req.headers.referer; 
   /* referer= referer.replace(/\/$/, ""); */
    var id=req.params.id;
    mongoClient = await connectToDatabse(MongoPath);
     const db = mongoClient.db('double');
     const collection = db.collection('settings');
    
      await findSettingsById(collection, id ).then((data)=>{
       settings=data;
       count=data.length;
      });  
       
     var saved_shop="https://"+settings.shop+'/';
      //res.status(200).send(saved_shop);
      // if(saved_shop==referer){
        var filePath=cwd +'/public/'+req.params.jsfile ;
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res); 
     /*   } else{
        res.status(500).send("OOPS!!");
       } */
       
  
})


app.post("/static/avatar",   async  (req, res) => {
  const unique_session_id = uuidv4();
  var fileBuffer = req.files.file.data;
  fileBuffer.name = req.files.file.name;
  
  var result="None"; 
  const file = req.files.file;
  var filename= req.files.file.name;
  const size = req.body.size;
  const gender = req.body.gender; 
  const imageType = req.files.file.mimetype.replace('image/', '.')
 
  //const localOrigin= req.body.localOrigin; 
  var filepath =    file.tempFilePath+imageType; 
  result =filepath;
  //filepath =    cwd+'/public/'+filename; 
  fs.renameSync(file.tempFilePath, filepath)
  //filepath=filepath+filename; 
   
 //var filedata=await fs.createReadStream(filepath);
 /*  await file.mv(`${filepath}`, (err) => {
    if (err) {
      res.status(500).send({ message: "File upload failed", code: 200 });
    } 
  });  */
  /* const url = 'https://hybrik.azurewebsites.net/';
    const sessionId = 'bmF2ZWVudGVzdDEubXlzaG9waWZ5LmNvbS9hZG1pbg';
     // const size = 10;
      //const gender = 'm';
      
    const form = new FormData();
      form.append('session_id', sessionId);
      form.append('size', size);
      form.append('gender', gender);
      form.append('file',   fs.createReadStream(filepath));
     
      var glbfileurl='';
      await fetch(url, {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
      })
      .then((response) => response.text())
      .then((data) => {
          
         // console.log(data); 
         result=data;
        })
      .catch((error) => {
          //console.error(error);
           
          result=error;
        });  */   
         
        /* const glbfilename= path.basename(glbfileurl);
        //const glbDownloadFolder=cwd +'/public/glbs/';
         
        const glbDownloadPath=cwd +'/public/glbs/'+glbfilename
        //const glbDownloadFile=glbDownloadFolder+glbfilename
        await  download(glbfileurl,glbDownloadPath)
        .then((response)=>{
          var glbfilename=  response ;
            glbfilename= path.basename(glbfilename);
          result=localOrigin +'/static/glb/'+glbfilename;;
        })  ;  */ 
      
        
        res.status(200).send(result);
   
});
app.post("/static/garment",   async  (req, res) => {
     
    var result;
    
     const sessionId = req.body.session;
    const size = req.body.size;
    const productid = req.body.productid; 
    const url = 'https://simple-to-complex.azurewebsites.net' ;
      let garmentData = { 
        "productid": productid ,
        "session": sessionId ,
        "size":size
      }
     ;
     
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(garmentData),
        headers: {"Content-Type": "application/json"}
      })
     .then((response) =>response.json())
      .then((data) => {
       
         result=data;
         console.log("result",data)
        })
      .catch((error) => {
          console.error(error);
          result=error;
        });       


        
        res.status(200).send(result);
});





app.post("/static/testgarment",   async  (req, res) => {
     
  var result ;
  var glbfileurl='';
  var avatarglb='';
   const sessionId = req.body.session;
  const size = req.body.size;
  const productid = req.body.productid; 
  const localOrigin = req.body.localOrigin; 
 
   const url = 'https://simple-to-complex.azurewebsites.net' ;
    let garmentData = { 
      "productid": productid ,
      "session": sessionId ,
      "size":size
    }
   ;



  /*await fetch(url, {
      method: 'POST',
      body: JSON.stringify(garmentData),
      headers: {"Content-Type": "application/json"}
    })
   .then((response) =>response.json())
    .then((data) => {
      console.log("glb Response2",data)
      result=data;
        avatarglb=data.avatarglb;
       glbfileurl=data.uppergarmentglb;  
       glbfileurl=glbfileurl.replace('http://','https://');   
      })
    .catch((error) => {
        //console.error(error);
        result=error;
      });   
       
      const glbfilename= path.basename(glbfileurl);
 
       
      const glbDownloadPath=cwd +'/public/glbs/'+glbfilename
      
      //const glbDownloadFile=glbDownloadFolder+glbfilename
      await  download(glbfileurl,glbDownloadPath)
      .then((response)=>{

        var glbfilename=  response ;
          glbfilename= path.basename(glbfilename);
        result={
          "avatarglb":avatarglb,
          'uppergarmentglb':localOrigin+'/static/glb/'+glbfilename
      
          }

      }).catch((error) => {
        result={
          "error": error,
          "glbfileurl": glbfileurl
      
          }
        
      });  */     

result ={
	"avatarglb": "",
	"lowergarmentglb": localOrigin+'/static/glb/final_M4128gw016.glb',
	"uppergarmentglb": localOrigin+'/static/glb/final_M4128gw016.glb'
}
      
      res.status(200).send(result);
});


function download(url, dest) {
  return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);

      const request = http.get(url, response => {
          if (response.statusCode === 200) {
              response.pipe(file);
          } else {
              file.close();
              fs.unlink(dest, () => {}); // Delete temp file
              reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
          }
      });

      request.on("error", err => {
          file.close();
          fs.unlink(dest, () => {}); // Delete temp file
          reject(err.message);
      });

      file.on("finish", () => {
      
          resolve(dest);
      });

      file.on("error", err => {
          file.close();

          if (err.code === "EEXIST") {
              reject("File already exists");
          } else {
              fs.unlink(dest, () => {}); // Delete temp file
              reject(err.message);
          }
      });
  });
}
  
app.post("/api/settings/get", async (_req, res) => {
  const unique_session_id = uuidv4();
  //generate uniquetoken id 
  const shopify_session=res.locals.shopify.session;
  let host = _req.body.host;
  let sessionToken = _req.body.sessionToken;
  let localOrigin = _req.body.localOrigin;
  let mongoClient;
  let settings;
  let jsurl='';
  try {
      mongoClient = await connectToDatabse(MongoPath);
      const db = mongoClient.db('double');
      const collection = db.collection('settings');
      settings=  await findSettingsByShop(collection,res.locals.shopify.session.shop);
       /* if((process.env.NODE_ENV === "development") &&  (settings.length>0)){
        
          jsurl=localOrigin+'/static/js/double-button.js' ;
          const script_tag = new shopify.api.rest.ScriptTag({session: res.locals.shopify.session}); 
          script_tag.id =  settings[0].scripttagid;
          script_tag.cache=false;
          script_tag.src = jsurl;
            await script_tag.save({
            update: true,
          }); 
      }  */
         
      
  } finally {
      await mongoClient.close();
  }  

  const result={session:res.locals.shopify.session,
    settings:settings ,
    jsurl:jsurl 
    
  };
  res.status(200).send(result);
   
});
export async function connectToDatabse(uri) {
  let mongoClient;
  try {
      mongoClient = new MongoClient(uri);
      await mongoClient.connect();
      return mongoClient;
  } catch (error) {
      console.error('Connection to MongoDB Atlas failed!', error);
      process.exit();
  }
}

export async function createSettings(collection,settingDocument) {
/*   const settingDocument = {
      shop:  res.locals.shopify.session.shop,
      birthdate: new Date(2000, 11, 20),
      address: { street: 'Pike Lane', city: 'Los Angeles', state: 'CA' },
  }; */

  await collection.insertOne(settingDocument);
}

export async function findSettingsByShop(collection, shop) {
  return collection.find({ shop }).toArray();
}
export async function findSettingsById(collection, id) {
  var oid=new mongo.ObjectId(id)
  return collection.findOne({ _id: oid}) ;
}
export async function deleteSettingsByShop(collection, shop) {
  await collection.deleteMany({ shop });
}
/* export async function setUpScript(wd,url){
  const script_file=wd+'/double-button.js';
  const script_file_topost=wd+'/public/js/double-button.js';
   
  readFile(script_file, 'utf8', function (err,data) {
    if (err) {
        console.log(err);
        return;
    }
    var content = data.replace(/SHOPIFY_LOCATION_URL/g, url);
  
       writeFile(script_file_topost, content, 'utf8', function (werr) {
       // console.log(werr); 
    });  
  });

  return true;
} */
app.post("/api/doublebutton/process", async (_req, res) => {
  let result='success';
  let status = 200;
  let error = null;
  let host = _req.body.host;
  let sessionToken = _req.body.sessionToken;
  let localOrigin = _req.body.localOrigin;
  try {
   
    const themesResponse = await shopify.api.rest.Theme.all({
      session: res.locals.shopify.session,
    });

    const current_theme=  themesResponse.data.filter(themeitem => themeitem.role ===  "main")[0] ;
     
    const themid= current_theme.id==null?0: current_theme.id ;
   
    const theme_liquid_key= "layout/theme.liquid";
    const product_liquid_key= "sections/product-template.liquid";
    /* var assetsResponse = await shopify.api.rest.Asset.all({
        session: res.locals.shopify.session,
        theme_id: themid ,
        asset: {"key": theme_liquid_key},
      }); 

        
      const theme_liquid=  assetsResponse.data[0] ;
      var theme_liquid_content= theme_liquid.value==null?'': theme_liquid.value;      
      theme_liquid_content = theme_liquid_content.replace(/<\/head\>/gi, "<script src=\"{{ 'double-button.js' | asset_url }}\" defer='defer'></script>\r\n</head>");
      
      assetsResponse = await shopify.api.rest.Asset.all({
        session: res.locals.shopify.session,
        theme_id: themid ,
        asset: {"key": product_liquid_key},
      }); 
      const product_liquid=  assetsResponse.data[0] ;
      var product_liquid_content= product_liquid.value==null?'': product_liquid.value;  */   
      
   
     // product_liquid_content = product_liquid_content.replace(/<\/head\>/gi, "<script src=\"{{ 'double-button.js' | asset_url }}\" defer='defer'></script>\r\n</head>");
   

   
      let mongoClient;
       let settings;
       let count;
       try {
          mongoClient = await connectToDatabse(MongoPath);
          const db = mongoClient.db('double');
          const collection = db.collection('settings');
          
           await findSettingsByShop(collection,res.locals.shopify.session.shop).then((data)=>{
            settings=data;
            count=data.length;
           });
           
          if(count==0){
           // var setting_id=settings[0].id;
            var setting_id = new mongo.ObjectId()
           // console.log('setting_id',setting_id);
           const jsurl=localOrigin+'/static/js/'+setting_id.toString() +'/double-button.js' ;
            const script_tag = new shopify.api.rest.ScriptTag({session: res.locals.shopify.session}); 
            script_tag.event = "onload";
            script_tag.display_scope= "online_store",
            script_tag.cache=false;
            script_tag.src = jsurl;
              await script_tag.save({
              update: true,
            }); 
            
            const scripttagid =script_tag.id;   
          
           // console.log(scripttagid); 
               const collectonData={
               _id: setting_id,
              shop:  res.locals.shopify.session.shop,
              host: host,
              localorigin: localOrigin,
              scripttagid: scripttagid,
            }; 
           
            await createSettings(collection,collectonData);  
            

            result='Button has been published'
          }else{
             const scripttagid=settings[0].scripttagid;
              const script_tag_deleted = await shopify.api.rest.ScriptTag.delete(
              {
                session: res.locals.shopify.session,
                id: scripttagid
              }
              ); 
             await deleteSettingsByShop(collection, res.locals.shopify.session.shop);
             result='Button has been unpublished'
          }    
         
      } catch (error) {
        console.error(error);
        result=error;
        // Expected output: ReferenceError: nonExistentFunction is not defined
        // (Note: the exact output may be browser-dependent)
      }
      finally {
          await mongoClient.close();
      }  
      
      res.status(200).send(result); 
     /*   const scripttagid="256629604632";
              const script_tag_deleted = await shopify.api.rest.ScriptTag.delete(
              {
                session: res.locals.shopify.session,
                id: scripttagid
              }
              ); 
              
             result='script has been unpublished'
             res.status(200).send(result);  */

      /*const scriptTagResponse =  await shopify.api.rest.ScriptTag.all({
        session: res.locals.shopify.session
      });  
     res.status(200).send(scriptTagResponse);  */   
    
       

      /* const double_button_script =  readFileSync(  "double-button.js"  , 'utf8');
      const asset = new shopify.api.rest.Asset({session: res.locals.shopify.session});
      asset.theme_id = themid;
      asset.key = theme_liquid_key;
      asset.value = double_button_script;
      await asset.save({
        update: true,
      });  */
      
      

  } catch (e) {
    console.log(`Failed to process themes: ${e.message}`);
    status = 500;
    error = e.message;
  }
   
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
