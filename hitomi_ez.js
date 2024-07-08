// ==UserScript==
// @name         hitomi_ez
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Make hitomi.la easy to use: [space] to next page, F11 to built-in full screen, auto full spread read, and direct link to reader page when press the thumbnail in list
// @author       b3d1
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @match        https://hitomi.la/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitomi.la
// @grant        none
// @homepage     https://github.com/b3d1/UserScripts
// ==/UserScript==

(function() {
    'use strict';

    ah.proxy({
        onRequest: (config, handler) => {
            handler.next(config);
        },
        onResponse: (res, handler) => {
            if (res.config.url.includes('/galleryblock/')){
                var body = $(`<div>${res.response}</div>`)
                var a = body.find("a.lillie:first")
                a.attr("href",a.attr("href").replace(/.*-(\d+).html/,'/reader/$1.html'))
                res.response = body.html()
            }
            handler.resolve(res)
        }
    })


    if (/\/reader\//.test(location.href)){
        var after_init=()=>{
            fullSpread()

            $(document).on("keydown",(event)=>{
                if (event.key == " "){
                    $("#nextPanel").click()
                }
                if (event.key == "F11"){
                    event.preventDefault()
                    $("#fullscreen").click()
                }
            })
        }

        var o_desktop_init = desktop_init
        desktop_init = ()=>{
            o_desktop_init()
            after_init()
        }
    }

})();