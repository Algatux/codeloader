/****************************************************************************
*
*  Title :     Codeloader
*
*  Author:     Alessandro Galli [a.galli85(at)gmail.com]
*  Date :      25/02/2015 @ 15:53
*  Version :   1.2
*
*  Description: Dynamic loader of javascript code and css, they can be loaded and 
*               executed after page load on request.
*               
*  Use : 1- Include this file into your page into head tag
*  
*        2- call che loader by using the function: 
*           codeloader.addScript('/myjavascripts/dummy.js')
*           codeloader.addStyle('/mycss/dummy.css','screen') //screen is set by default 
*           
*        3- if you want to specify a callback function, use it like :
*           codeloader.addScript('/myjavascripts/dummy.js',function(){ 
*                                                     alert('my callback!') 
*                                                    })
*
****************************************************************************/
function codeloader(){
    var debug=false;
    var randomize_version=1;
    var loadedScripts=new Array();
    var loadedStyles=new Array();
    var defaultPath='';
    
    // initialization
    var pageScripts = document.getElementsByTagName('script');
    var sNum = pageScripts.length;
    debugEcho('Scripts tags included into page: '+sNum);
    for(var i=0 ; i < sNum ; i++){
        var src = pageScripts[i].src.replace(/\\/g,'/').replace( /.*\//, '' );
        if (typeof src!=="undefined" && src.length>0){
            debugEcho('['+i+']PreLoaded script: '+src);
            loadedScripts.push(src);
        }else{
            debugEcho('Script tag without src not included in list');    
        }
    }
    var pageCss = document.getElementsByTagName('link');
    var cNum = pageCss.length;
    for(i=0 ; i < cNum ; i++){
        var href = pageCss[i].getAttribute('href').replace(/\\/g,'/').replace( /.*\//, '' );
        if (typeof href!=="undefined" && href.length>0){
            debugEcho('['+i+']PreLoaded stylesheet: '+href);
            loadedStyles.push(href);
        }else{
            debugEcho('Link tag without href not included in list');    
        }
    }
     //INTERFACES
     this.addScript = function(path,callback){
                var filename = path.replace(/\\/g,'/').replace( /.*\//, '' );
                var isLoaded = isAlreadyLoaded(filename,'js');
                if(isLoaded) debugEcho('Code already loaded');
                if(createScriptElement(path,callback,isLoaded)){
                    loadedScripts.push(filename);
                    debugEcho('['+loadedScripts.indexOf(filename)+']Loaded code from: '+path)
                }

      return this;
     }

     this.addStyle = function(path,media,callback){
                var filename = path.replace(/\\/g,'/').replace( /.*\//, '' );
                if(typeof fileref==="undefined")
                    media = 'screen';
                if(!isAlreadyLoaded(filename,'css')){
                    if(createLinkElement(path,media,callback)){
                        loadedStyles.push(filename);
                        debugEcho('['+loadedStyles.indexOf(filename)+']Loaded styles from: '+path)
                    }
                }else
                    debugEcho('Stylesheet already loaded');
      return this;
     }
     
     
     this.setDefaultPath = function(path){defaultPath = path;return this;}
     
     this.listLoadedScripts = function(){console.log(loadedScripts);return this;}
     this.listLoadedStyles = function(){console.log(loadedStyles);return this;}
     
     function attachRandomVersion(string){
         var rand = parseInt(Math.random()*1000000);
         if(string.indexOf("?")===-1)
             return string+'?v='+rand;
         else
             return string+'&jv='+rand;
     }
     
     //Code Manipulation functions
     function createScriptElement(path,callback,alreadyLoaded){
         if(!alreadyLoaded){
             var fileref=document.createElement("script");
             fileref.setAttribute("type", "text/javascript");
             var scriptpath = (randomize_version)? attachRandomVersion(defaultPath+path) : defaultPath+path;
             fileref.setAttribute("src",scriptpath);
             if (typeof callback !== 'undefined') execCallback(callback, fileref);
             if (typeof fileref!=="undefined"){
                 document.getElementsByTagName("head")[0].appendChild(fileref);
                 return true;
             }
             return false;
         }else{
             if (typeof callback !== 'undefined') execCallback(callback);
         }

     }
     
     function createLinkElement(path,media,callback){
                                var fileref=document.createElement("link");
                                fileref.setAttribute("rel", "stylesheet");
                                fileref.setAttribute("type", "text/css");
                                var csspath = (randomize_version)? attachRandomVersion(defaultPath+path) : defaultPath+path;
                                fileref.setAttribute("href", csspath);
                                fileref.setAttribute("media", media);
                                if (callback) execCallback(callback, fileref);
                                if (typeof fileref!=="undefined"){
                                        document.getElementsByTagName("head")[0].appendChild(fileref);
                                        return true;
                                }
                                return false;
     }
    
     // Operational functions
     function isAlreadyLoaded(file,type){
        if(type==='js')
            if(loadedScripts.indexOf(file) != -1)    return true;
        else if(type==='css')
            if(loadedStyles.indexOf(file) != -1)     return true;
        return false;
     }
     
     function execCallback(callback,fileref){
         if(typeof fileref === 'undefined')
            callback();
         else if (fileref.readyState){  //IE
                fileref.onreadystatechange = function(){
                    if (fileref.readyState==="loaded" || fileref.readyState==="complete"){
                        callback();
                        fileref.onreadystatechange = null;
                        debugEcho('Callback of '+fileref.src+' Executed')
                    }
                };
         } else {  //Others
                fileref.onload = function(){
                    callback();
                    debugEcho('Callback of '+fileref.src+' Executed')
                };
         }
     }
     // Debug and info function
     function debugEcho(str){if(debug) console.log(str);}
     
}
var cl=new codeloader();
