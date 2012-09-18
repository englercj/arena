var util = {
};

define(util);

//SHIM
window.requestAnimFrame = window.requestAnimationFrame       || 
                            window.webkitRequestAnimationFrame || 
                            window.mozRequestAnimationFrame    || 
                            window.oRequestAnimationFrame      || 
                            window.msRequestAnimationFrame     || 
                            function(callback) {
                                window.setTimeout(callback, 1000 / 60);
                            };