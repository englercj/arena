define([
    //Modules
    'jquery'
    //Scripts that modify global
], function($) {
    var Viewport = Class.extend({
        init: function(container) {
            if(!container)
                this._$container = $(window);
            else if(!container.jquery)
                this._$container = $(container);
            else
                this._$container = container;
        },
        height: function() { return this._$container.height.apply(this._$container, arguments); },
        width: function() { return this._$container.width.apply(this._$container, arguments); },
        append: function() { return this._$container.append.apply(this._$container, arguments); },
        aspect: function() {
            return (this.width() / this.height());
        }
    });
    
    return Viewport;
});