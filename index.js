const express = require("express");  
const bodyParser = require("body-parser");  
const fs = require("fs");
const cookieParser = require('cookie-parser');
const app = express();  
var md5 = require('md5');
  
app.use(bodyParser.urlencoded({ extended:  false  }));  
app.use(bodyParser.json()); 
app.use(cookieParser()); 
  

var userInfo = {

}


app.get('/',function (req,res) {  
    

    var name = 'guest';
    var youtubeAddr = 'https://www.youtube.com/embed/v64KOxKVLVg';

    if(req.cookies.uname){
        name = req.cookies.uname;
        if(userInfo[name])
            youtubeAddr = 'https://www.youtube.com/embed/'+userInfo[name];

    }
       

    fs.readFile(__dirname + '/view/index.html', 'UTF-8',
         (err, data) => {
            var conv_data = data.replace(/#name#/g, name).replace(/#youtubeAddr#/g, youtubeAddr);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(conv_data);
            res.end();
        }
    )

 
});  

app.get('/userinfo',function (req,res) {  

    //console.log(req.query.youtube_addr)
    const urlsplited = req.query.youtube_addr.split('/');

    const md5usernad = md5(req.query.uname)
    
    //const md5usernad = req.query.uname
    
    userInfo[md5usernad] = urlsplited[urlsplited.length-1];
    
    console.log(userInfo);

    res.cookie('uname',md5usernad,{
        maxAge:1000000
     });
   
   
    res.redirect('/');  
});
//removecookie
app.get('/removecookie',function (req,res) {  
    console.log('removecookie')
    res.clearCookie('uname');
    res.redirect('/');  
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});