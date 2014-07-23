(function(globals, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'jquery', 'bsp-utils' ], factory);
    } else {
        factory(globals.jQuery, globals.bsp_utils, globals);
    }

})(this, function($, bsp_utils, globals) {
    return bsp_utils.plugin(globals, 'bsp', 'share', {
        '_defaultOptions': {
            "service" : "",
            "title" : document.title !== undefined ? encodeURIComponent(document.title) : "",
            "url" : window.location.origin + window.location.pathname,
            "redirectUrl" : window.location.origin + window.location.pathname,
            "description" : $("meta[property='og:description']").attr('content') !== undefined ? encodeURIComponent($( "meta[property='og:description']").attr('content')) : "",
            "caption" : $("meta[property='og:caption']").attr('content') !== undefined ? encodeURIComponent($( "meta[property='og:caption']").attr('content')) : "",
            "image" : $("meta[property='og:image']").attr('content') !== undefined ? encodeURIComponent($( "meta[property='og:image']").attr('content')) : "",
            "appId" : "",
            "trackingUrl" : ""
        },
        '_init' : function(roots, selectors) {
            var plugin = this;

            plugin._on(roots, 'click', '.bsp-share-link', function(event){
                event.preventDefault();
                event.stopPropagation(); //fixes twitter widget creating second pop-up
                bsp_share.share($(this).attr("href"), $(this).attr("data-shareWidth"), $(this).attr("data-shareHeight"));

                var _trackingUrl = plugin.option($(this).parent(),"trackingUrl");
                if (_trackingUrl) {
                    $.ajax({ url: _trackingUrl});
                }
            });
        },
        '_each': function(share) {
            var plugin = this;
            var $share = $(share);

            if (!plugin.option(share, 'service')) {
                console.error("Service parameter is missing");
                return;
            }

            var shareUrl;
            var width = 1000;
            var height = 400;


            if (plugin.option(share, 'service') === "facebook") {
                    shareUrl = "https://www.facebook.com/dialog/feed?" +
                            "app_id="      + plugin.option(share, 'appId')         + "&" +
                            "link="        + plugin.option(share, 'url')           + "&" +
                            "caption="     + plugin.option(share, 'caption')       + "&" +
                            "description=" + plugin.option(share, 'description')   + "&" +
                            "redirect_uri=" + plugin.option(share, 'redirectUrl')   + "&" +
                            "picture="     + plugin.option(share, 'image');
            }else if (plugin.option(share, 'service') === "google") {
                shareUrl = "https://plus.google.com/share?" +
                           "url=" + plugin.option(share, 'url');
                width = 600;
            }else if (plugin.option(share, 'service') === "linkedIn") {
                shareUrl = "https://www.linkedin.com/shareArticle?" +
                        "summary="  + plugin.option(share, 'description')    + "&" +
                        "ro="       + "false"                                + "&" +
                        "title="    + plugin.option(share, 'title')          + "&" +
                        "mini="     + "true"                                 + "&" +
                        "url="      + plugin.option(share, 'url');
            }else if (plugin.option(share, 'service') === "pinterest") {
                shareUrl = "http://pinterest.com/pin/create/bookmarklet/?" +
                           "url="         + plugin.option(share, 'url')         + "&" +
                           "title="       + plugin.option(share, 'title')       + "&" +
                           "description=" + plugin.option(share, 'description') + "&" +
                           "media="       + plugin.option(share, 'image');
                width = 750;
            }else if (plugin.option(share, 'service') === "twitter") {
                shareUrl = "https://twitter.com/intent/tweet?" +
                        "original_referer=" + location.href                    + "&" +
                        "text="             + plugin.option(share, 'title')    + "&" +
                        "url="              + plugin.option(share, 'url');
            }

            if (shareUrl !== undefined) {
                $share.append(bsp_share.shareTag($share, shareUrl, height, width));
            }
        },
        shareTag : function($share, shareUrl, height, width) {
            var shareLink = document.createElement("a");
            shareLink.className = "bsp-share-link";
            shareLink.setAttribute("href", shareUrl);
            shareLink.setAttribute("target", "_blank");
            shareLink.setAttribute("data-shareHeight", height);
            shareLink.setAttribute("data-shareWidth", width);
            $share.append(shareLink);
        },
        share : function (href, width, height) {
            var left = (screen.width/2)-(width/2);
            var top = (screen.height/2)-(height/2);

            window.open(href, 'share', 'width='+width+', height='+height+', top='+top+', left=' + left + ' toolbar=1, resizable=0');
        }
    });
});
