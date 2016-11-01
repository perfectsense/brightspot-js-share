/**
 * Default BSP Share Plugin
 *
 * This allows you turn some HTML markup into a share bar, utilizing the currently known sharing URLs for the most
 * popular sharing services. It's customizable, in that you can pass in a custom sharing service, urls,
 * popup sizes, etc as required.
 *
 * The most basic use example is designating a piece of the DOM with some elements that have classes named
 * for each of the supported services.
 * 1) You can leave off any services if you do not want those.
 * 2) You also need to pass in the facebook app id.
 * 3) The plugin also drops on an icon class for you, so if you are not using the default 'fa' class, you will want to pass in an override
 * 4) Lastly, if you need link text vs just an icon, you can pass in an optional linkText in each of the serviceProps throught the data-bsp-share-options pattern
 *
 * <div class="bsp-sharing" data-bsp-share data-bsp-share-options='{"iconClass":"icon", "serviceProps":{"facebook":{"appId":"645138725541385"}}}'>
 *      <div class="bsp-facebook-share"></div>
 *      <div class="bsp-twitter-share"></div>
 *      <div class="bsp-google-share"></div>
 *      <div class="bsp-pinterest-share"></div>
 *      <div class="bsp-linkedin-share"></div>
 * </div>
 *
 * The plugin allows you to customize just about everything, and below are a couple of examples of share-options that you can pass in
 *
 * 1) Instead of using the meta tags, pass in your own title and description
 *    data-bsp-share-options='{"title": "My Custom Title", "description": "My Custom Description"}'
 *
 * 2) Add in a tracking URL to track Google Shares
 *    data-bsp-share-options='{"serviceProps":{"google":{"trackingUrl":"http://asdf.com"}}}'
 *
 * 3) Instead of the default "bsp-service-share" class name, put in your own namespace for the share div classes and links
 *    ex: <div class="asdf-facebook-share"></div> and your a will be .asdf-share-link if you need to style them
 *    data-bsp-share-options='{"serviceClassBefore":"asdf-", "sharingClass": "asdf-share-link"}''
 *
 */
import $ from 'jquery';
import bsp_utils from 'bsp-utils';

var module = {

    serviceProps: {
        'facebook'  : {
            'baseUrl'       : 'https://www.facebook.com/dialog/feed?',
            'appId'         : '',
            'trackingUrl'   : '',
            'width'         : 1000,
            'height'        : 400,
            'linkText'      : ''
        },
        'google'    : {
            'baseUrl'       : 'https://plus.google.com/share?',
            'trackingUrl'   : '',
            'width'         : 1000,
            'height'        : 400,
            'linkText'      : ''
        },
        'linkedin'  : {
            'baseUrl'       : 'https://www.linkedin.com/shareArticle?',
            'trackingUrl'   : '',
            'width'         : 1000,
            'height'        : 600,
            'linkText'      : ''
        },
        'pinterest' : {
            'baseUrl'       : 'http://pinterest.com/pin/create/bookmarklet/?',
            'trackingUrl'   : '',
            'width'         : 1000,
            'height'        : 400,
            'linkText'      : ''
        },
        'tumblr'  : {
            'baseUrl'       : 'https://www.tumblr.com/share?',
            'trackingUrl'   : '',
            'width'         : 1000,
            'height'        : 400,
            'linkText'      : ''
        },
        'twitter'  : {
            'baseUrl'       : 'https://twitter.com/intent/tweet?',
            'trackingUrl'   : '',
            'width'         : 1000,
            'height'        : 300,
            'linkText'      : ''
        }
    },

    init: function($el, options) {

        var self = this;
        var serviceProps;

        // pull in the options from the plugin
        self.$el = $el;
        self.options = options;

        // we have our own default service props. Pull in the overrides from the plugin, which we then
        // use to extend our own defaults, to create the final serviceProps object that we use
        serviceProps = options.serviceProps;
        options.serviceProps = $.extend(true, self.serviceProps, serviceProps);

        self._createLinks();
        self._createClickHandler();

    },

    /**
     * Public API to share to a specific service.
     * This is preferable over someone trying to click on of our links manually if they want to use our plugin vs creating one of their own
     *
     * Example:
     *      var bspShare = $('.bsp-sharing[data-bsp-share]').data('bsp-share'); // pulls in the instance
     *      bspShare.share('facebook');
     */
    share: function(service){

        var self = this;
        var $serviceLink = self.$el.find('[data-service=' + service + ']');

        self._openSharePopup($serviceLink);
        self._trackShare($serviceLink);

    },

    _createLinks: function() {
        var self = this;
        var services = self.options.services;
        var $shareLink;
        var currentService;

        // we go through the services, and create the actual a elements that will be clicked on by the user
        for (var i = 0; i < services.length; i++) {

            currentService = services[i];

            $shareLink = $('<a>').addClass(self.options.sharingClass)
                                 .addClass(self.options.iconClass)
                                 .addClass(self.options.iconClass + '-' + currentService);

            $shareLink.attr('data-shareHeight', self.options.serviceProps[currentService].height);
            $shareLink.attr('data-shareWidth', self.options.serviceProps[currentService].width);
            $shareLink.attr('data-service', currentService);
            $shareLink.attr('href', self._createShareURL(currentService));
            $shareLink.attr('target', '_blank');
            $shareLink.attr('title', self.options.sharingText + ' ' + currentService);
            $shareLink.html(self.options.serviceProps[currentService].linkText);

            $shareLink.appendTo(self.$el.find('.' + self.options.serviceClassBefore + currentService + self.options.serviceClassAfter));
        }

    },

    _createShareURL: function(service) {
        let self = this;
        let serviceProps = self.options.serviceProps[service];
        let shareUrl = self.options.serviceProps[service].baseUrl;

        let caption =       encodeURIComponent(serviceProps.caption || self.options.caption);
        let description =   encodeURIComponent(serviceProps.description || self.options.description);
        let image =         encodeURIComponent(self.options.image);
        let title =         encodeURIComponent(serviceProps.title || self.options.title);
        let url =           encodeURIComponent(self.options.url);
        let redirectUrl =   encodeURIComponent(self.options.redirectUrl);

        // each service gets a custom URL based on the options that were passed in
        switch (service) {
            case 'facebook':

                shareUrl += 'app_id='       + self.options.serviceProps[service].appId + '&' +
                            'link='         + url           + '&' +
                            'caption='      + caption       + '&' +
                            'description='  + description   + '&' +
                            // this prevents facebook's popup from also showing the shared page
                            // and staying open w/ that 2nd instance ...
                            // 'redirect_uri=' + redirectUrl   + '&' +
                            'picture='      + image;
                break;

            case 'google':

                shareUrl += 'url=' + url;
                break;

            case 'linkedin':

                shareUrl += 'summary='  + description    + '&' +
                            'ro='       + 'false'        + '&' +
                            'title='    + title          + '&' +
                            'mini='     + 'true'         + '&' +
                            'url='      + url;
                break;

            case 'pinterest':

                shareUrl += 'url='         + url         + '&' +
                            'title='       + title       + '&' +
                            'description=' + description + '&' +
                            'media='       + image;
                break;

            case 'tumblr':

                shareUrl += 'v=3&u=' + url + '&' +
                            't='     + title;
                break;

            case 'twitter':

                shareUrl += 'original_referer=' + encodeURIComponent(location.href) + '&' +
                            'text='             + title                             + '&' +
                            'url='              + url;
                break;
        }

        return shareUrl;
    },

    _createClickHandler: function() {
        var self = this;

        self.$el.on('click', '.' + self.options.sharingClass, function(event) {
            event.preventDefault();
            event.stopPropagation();

            self._openSharePopup($(this));
            self._trackShare($(this));
        });
    },

    _openSharePopup: function($link) {

        var self = this;

        var width = $link.attr('data-shareWidth');
        var height = $link.attr('data-shareHeight');
        var left = (screen.width/2)-(width/2);
        var top = (screen.height/2)-(height/2);

        window.open($link.attr('href'), 'share', 'width='+width+', height='+height+', top='+top+', left=' + left + ' toolbar=1, resizable=0');

    },

    _trackShare: function() {
        var self = this;

        if (self.options.trackingUrl) {
            $.ajax({
                url: self.options.trackingUrl
            });
        }
    }

};

var thePlugin = {

    '_defaultOptions': {
        'services'           : ['facebook', 'google', 'linkedin', 'pinterest', 'tumblr', 'twitter'],

        'caption'            : $('meta[property="og:caption"]').attr('content') || '',
        'description'        : $('meta[property="og:description"]').attr('content') || '',
        'image'              : $('meta[property="og:image"]').attr('content') || '',
        'title'              : document.title || '',

        'url'                : window.location.protocol + '//' + window.location.hostname + window.location.pathname,
        'redirectUrl'        : window.location.protocol + '//' + window.location.hostname + window.location.pathname,

        'sharingClass'       : 'bsp-share-link',
        'serviceClassBefore' : 'bsp-',
        'serviceClassAfter'  : '-share',
        'sharingText'        : 'Share on',
        'iconClass'          : 'fa'
    },

    '_each': function(item) {

        var options = this.option(item);

        var moduleInstance = Object.create(module);
        moduleInstance.init($(item), options);

        // expose the instance of the module on the item if anyone else needs to use the public API
        $(item).data('bsp-share', moduleInstance);
    }
};

export default bsp_utils.plugin(false, 'bsp', 'share', thePlugin);
