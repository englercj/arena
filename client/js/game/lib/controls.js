define([
    //Modules
    'jquery',
    'game/lib/constants',
    //Scripts that modify global
    'game/vendor/three/three.min'
], function($, CONST) {
    var Controls = Class.extend({
        init: function(viewport, camera) {
            this.viewport = viewport;
            this.camera = camera;
            
            this.target = new THREE.Vector3(0, 0, 0);
            
            this.moveSpeed = CONST.MOVE_SPEED;
            this.lookSpeed = CONST.LOOK_SPEED;
            
            this.lookVertical = true;
            this.activeLook = true;
            
            this.heightSpeed = false;
            this.heightCoef = 1.0;
            this.heightMin = 0;
            this.heightMax = 1;
            
            this.constrainVertical = false;
            this.verticalMin = 0;
            this.verticalMax = Math.PI;
            
            this.mouseX = 0;
            this.mouseY = 0;
            
            this.lat = 0;
            this.lon = 0;
            this.phi = 0;
            this.theta = 0;
            
            this.autoSpeedFactor = 0.0;
            
            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;
            this.moveUp = false;
            this.moveDown = false;
            this.freeze = false;
            
            this.mouseDragOn = false;

            this.viewHalfX = 0;
            this.viewHalfY = 0;
            
            this.viewport.on({
                resize: $.proxy(this.onResize, this),
                mousedown: $.proxy(this.onMouseDown, this),
                mouseup: $.proxy(this.onMouseUp, this),
                mousemove: $.proxy(this.onMouseMove, this)
            });
            
            //hack for catching keydown/up events
            $(document).on({
                keydown: $.proxy(this.onKeyDown, this),
                keyup: $.proxy(this.onKeyUp, this)
            });
            
            this.onResize();
        },
        onResize: function(e) {
            this.viewHalfX = this.viewport.width() / 2;
            this.viewHalfY = this.viewport.height() / 2;
        },
        onKeyDown: function(e) {
            if(!document.pointerLockElement) return;
            console.log(e);
            //e.preventDefault();
            
            switch(e.which) {
                case 9: //Tab
                    //hide score card
                    break;
                    
                case 38: //up
                case 87: //W
                    this.moveForward = true;
                    break;

                case 37: //left
                case 65: //A
                    this.moveLeft = true;
                    break;

                case 40: //down
                case 83: //S
                    this.moveBackward = true;
                    break;

                case 39: //right
                case 68: //D
                    this.moveRight = true;
                    break;

                case 82: //R
                    this.moveUp = true;
                    break;
                    
                case 70: //F
                    this.moveDown = true;
                    break;

                case 81: //Q
                    this.freeze = !this.freeze; break;
            }
        },
        onKeyUp: function(e) {
            if(!document.pointerLockElement) return;
            console.log(e);
            //e.preventDefault();
            
            switch(e.which) {
                case 9: //Tab
                    //hide score card
                    break;
                
                case 38: //up
                case 87: //W
                    this.moveForward = false;
                    break;

                case 37: //left
                case 65: //A
                    this.moveLeft = false;
                    break;

                case 40: //down
                case 83: //S
                    this.moveBackward = false;
                    break;

                case 39: //right
                case 68: //D
                    this.moveRight = false;
                    break;

                case 82: //R
                    //reload
                    break;
                    
                case 70: //F
                    //drop gun
                    break;

                case 72: //H
                    this.freeze = !this.freeze;
                    break;
            }
        },
        onMouseDown: function(e) {
            console.log(e);
            e.preventDefault();
            e.stopPropagation();
            
            if(this.activeLook) {
                switch(e.button) {
                    case 0: //left click
                        break;
                    case 1: //middle click
                        break;
                    case 2: //right click
                        break;
                }
            }
            
            this.mouseDragOn = true;
        },
        onMouseUp: function(e) {
            console.log(e);
            e.preventDefault();
            e.stopPropagation();
            
            if(this.activeLook) {
                switch(e.button) {
                    case 0: //left click
                        break;
                    case 1: //middle click
                        break;
                    case 2: //right click
                        break;
                }
            }
            
            this.mouseDragOn = false;
        },
        onMouseMove: function(e) {
            if(!document.pointerLockElement) return;
            var movementX = e.originalEvent.movementX       ||
                            e.originalEvent.mozMovementX    ||
                            e.originalEvent.webkitMovementX ||
                            0,
                movementY = e.originalEvent.movementY       ||
                            e.originalEvent.mozMovementY    ||
                            e.originalEvent.webkitMovementY ||
                            0;

            //Update the initial coords on mouse move
            this.mouseX += movementX * CONST.LOOK_SPEED_X;
            this.mouseY += movementY * -CONST.LOOK_SPEED_Y;

            //Update camera position
            this.camera.position.x = Math.sin(this.mouseX) * 400;
            this.camera.position.z = Math.cos(this.mouseX) * 400;
            this.camera.position.y = Math.atan(this.mouseY) * 400;
            /* else {
                console.log(e);
                
                //Use standard methods to move around
                this.coords.x = (e.clientX -  (this.viewport.width() / 2)) * 0.003;
                this.coords.y = (e.clientY -  (this.viewport.height() / 2));
                
                this.camera.position.x = Math.cos(this.coords.x) * 300;
                //this.camera.position.z = Math.sin(this.coords.x) * 300;
                this.camera.position.y = this.coords.y * -0.4;
            }*/
        },
        update: function(delta) {            
            if(this.freeze) {
                return;
            }
            
            var actualMoveSpeed = delta * this.moveSpeed;
            
            if(this.moveForward) this.camera.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
            if(this.moveBackward) this.camera.translateZ(actualMoveSpeed);
            
            if(this.moveLeft) this.camera.translateX(-actualMoveSpeed);
            if(this.moveRight) this.camera.translateX(actualMoveSpeed);
        }
    });
    
    return Controls;
});