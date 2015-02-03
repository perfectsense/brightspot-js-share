# Installation

It's recommended that this plugin is used inside of the require/AMD space and using the brightspot-js-grunt task, as demonstrated in the BSP-101 project
- Pull in via your bower.json. It will be automatically included into your project by brightspot-js-grunt task
- Add it into your compile.js to have it be included in your JS output
- Add in your markup 

Example:

    <div class="bsp-sharing" data-bsp-share data-bsp-share-options='{serviceProps":{"facebook":{"appId":"645138725541385"}}}'>  
        <div class="bsp-facebook-share"></div>   
        <div class="bsp-twitter-share"></div>    
        <div class="bsp-google-share"></div> 
        <div class="bsp-pinterest-share"></div>  
        <div class="bsp-linkedin-share"></div>   
    </div>


If you want to use this plugin manualy, the [demo](http://perfectsense.github.io/brightspot-js-share/demo.html) shows you how to do that