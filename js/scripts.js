var MakesApp = function($, undefined) {

    this.ui = {
        body: $(document.body),
        imageWall: $('.imageWall')
    };

    this.events = {
        // 'click .apinav.guide>h3>a': 'openCommandList',
    };

    this.delegateEvents();

    if(this.ui.imageWall.length) {
        this.initImageWall();
    }
};

MakesApp.prototype.initImageWall = function() {
    var self = this;
    this.ui.imageWall.imagesLoaded(function(){
        self.ui.imageWall.masonry({
            itemSelector: '.item',
            isAnimated: true,
            columnWidth: 1
        });
    });
};

/**
 * delegate events to dom objects
 * this was cribbed from backbone, to see the original source take a look here:
 * https://github.com/jashkenas/backbone/blob/master/backbone.js#L1062
 */
MakesApp.prototype.delegateEvents = function() {

    var i = 0;
    for (var key in this.events) {
        var method = this[this.events[key]],
            eventName = key.split(' ')[0],
            selector = key.split(' ')[1];

        eventName += '.delegateEvents' + i;
        if (selector === '') {
            this.ui.body.on(eventName, method.bind(this));
        } else {
            this.ui.body.on(eventName, selector, method.bind(this));
        }

        ++i;
    }

};

(function ($, undefined) {

    // go into strict mode
    "use strict";

    var app = new MakesApp(jQuery);

})(jQuery);
