/****************************************************************************
*
*  Title :     Codeloader
*
*  Author:     Alessandro Galli [a.galli85(at)gmail.com]
*  Date :      29/01/2013 @ 10:20
*  Version :   1.1
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
*        3- if you want specify a callback function like :
*           codeloader.addScript('/myjavascripts/dummy.js',function(){ 
*                                                     alert('my callback!') 
*                                                    })
*
****************************************************************************/

function codeloader(){
    var debug=false;
    var loadedScripts=new Array();
    var loadedStyles=new Array();
    var defaultPath='';
    
    // initialization
    var pageScripts = document.getElementsByTagName('script');
    var sNum = pageScripts.length;
    debugEcho('Scripts tags included into page: '+sNum);
    for(var i=0 ; i < sNum ; i++){
        var src = pageScripts[i].src.replace(/\\/g,'/').replace( /.*\//, '' );
        if (typeof src!="undefined" && src.length>0){
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
        if (typeof href!="undefined" && href.length>0){
            debugEcho('['+i+']PreLoaded script: '+href);
            loadedStyles.push(href);
        }else{
            debugEcho('Link tag without href not included in list');    
        }
    }
     //INTERFACES
     this.addScript = function(path,callback){
                var filename = path.replace(/\\/g,'/').replace( /.*\//, '' );
                if(!isAlreadyLoaded(filename,'js')){
                    if(createScriptElement(path,callback)){
                        loadedScripts.push(filename);
                        debugEcho('['+loadedScripts.indexOf(filename)+']Loaded code from: '+path)
                    }
                }else
                    debugEcho('Code already loaded');
      return this;
     }
     this.addStyle = function(path,media,callback){
                var filename = path.replace(/\\/g,'/').replace( /.*\//, '' );
                if(typeof fileref=="undefined")
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
     
     //Code Manipulation functions
     function createScriptElement(path,callback){
                                var fileref=document.createElement("script");
                                fileref.setAttribute("type", "text/javascript");
                                fileref.setAttribute("src", defaultPath+path);
                                if (callback) execCallback(callback, fileref);
                                if (typeof fileref!="undefined"){
                                        document.getElementsByTagName("head")[0].appendChild(fileref);
                                        return true;
                                }
                                return false;
     }
     
     function createLinkElement(path,media,callback){
                                var fileref=document.createElement("link");
                                fileref.setAttribute("rel", "stylesheet");
                                fileref.setAttribute("type", "text/css");
                                fileref.setAttribute("href", defaultPath+path);
                                fileref.setAttribute("media", media);
                                if (callback) execCallback(callback, fileref);
                                if (typeof fileref!="undefined"){
                                        document.getElementsByTagName("head")[0].appendChild(fileref);
                                        return true;
                                }
                                return false;
     }
    
     // Operational functions
     function isAlreadyLoaded(file){
        for (key in loadedScripts) {
            if (!loadedScripts.hasOwnProperty[key]) continue;
            if (loadedScripts[key] == file) {return true;}
        }
        for (key in loadedStyles) {
            if (!loadedStyles.hasOwnProperty[key]) continue;
            if (loadedStyles[key] == file) {return true;}
        }
        return false;
     }
     
     function execCallback(callback,fileref){
         if (fileref.readyState){  //IE
                fileref.onreadystatechange = function(){
                    if (fileref.readyState == "loaded" || fileref.readyState == "complete"){
                        fileref.onreadystatechange = null;
                        callback();
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
     
};var cl=new codeloader();