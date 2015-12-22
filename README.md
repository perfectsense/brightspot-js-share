# Installation

NOTE: Starting with 3.0.0, bsp-share is an [ECMAScript 6 module](http://www.2ality.com/2014/09/es6-modules-final.html) instead of a [RequireJS module](http://requirejs.org/). If you need an AMD version, work in the 2.x.x branch.

It's recommended that this plugin is used inside of ES6 space and using the brightspot-js-grunt task, as demonstrated in the [Brightspot Base](https://github.com/perfectsense/brightspot-base) project
- Pull in via your bower.json. It will be automatically included into your project by brightspot-js-grunt task
- Import in main.js to have it be included in your JS output
- Add in your markup

Example:

    <div class="bsp-sharing" data-bsp-share data-bsp-share-options='{"iconClass":"icon", "serviceProps":{"facebook":{"appId":"645138725541385"}}}'>  
        <div class="bsp-facebook-share"></div>   
        <div class="bsp-twitter-share"></div>    
        <div class="bsp-google-share"></div>
        <div class="bsp-pinterest-share"></div>  
        <div class="bsp-linkedin-share"></div>   
    </div>


If you want to use this plugin manually, the [demo](http://perfectsense.github.io/brightspot-js-share/demo.html) shows you how to do that
