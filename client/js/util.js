jQuery.fn.center = function () {
    var $w = $(window);
    
    this.css({
        position: 'absolute',
        top: Math.max(0, (($w.height() - this.outerHeight()) / 2) + $w.scrollTop()) + 'px',
        left: Math.max(0, (($w.width() - this.outerWidth()) / 2) + $w.scrollLeft()) + 'px'
    });
    
    return this;
}
