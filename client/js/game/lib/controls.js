define([
    //Modules
    'jquery',
    'game/lib/constants'
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

            this.constrainVertical = true;
            this.verticalMin = CONST.VERTICAL_MIN;
            this.verticalMax = CONST.VERTICAL_MAX;

            this.mouseDeltaX = 0;
            this.mouseDeltaY = 0;

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
            e.preventDefault();

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
                    this.freeze = !this.freeze;break;
            }
        },
        onKeyUp: function(e) {
            if(!document.pointerLockElement) return;
            e.preventDefault();

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
            
            return false;
        },
        onMouseUp: function(e) {
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
            
            return false;
        },
        onMouseMove: function(e) {
            if(!document.pointerLockElement) return;

            var moveX = e.originalEvent.movementX       ||
                            e.originalEvent.mozMovementX    ||
                            e.originalEvent.webkitMovementX ||
                            0,
                moveY = e.originalEvent.movementY       ||
                            e.originalEvent.mozMovementY    ||
                            e.originalEvent.webkitMovementY ||
                            0;

            //Update the initial coords on mouse move
            this.mouseDeltaX += moveX * this.lookSpeed;
            this.mouseDeltaY += moveY * this.lookSpeed;
        },
        update: function(delta) {            
            if(this.freeze) {
                this.mouseDeltaX = 0;
                this.mouseDeltaY = 0;
                return;
            }

            //Taken from Three.js FirstPersonControls, modified to work with pointer lock
            var actualMoveSpeed = delta * this.moveSpeed;

            //movement
            if(this.moveForward) this.camera.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
            if(this.moveBackward) this.camera.translateZ(actualMoveSpeed);

            if(this.moveLeft) this.camera.translateX(-actualMoveSpeed);
            if(this.moveRight) this.camera.translateX(actualMoveSpeed);

            //look movement
            this.lon += this.mouseDeltaX;
            this.lat -= this.mouseDeltaY * (this.constrainVertical ? Math.PI / (this.verticalMax - this.verticalMin) : 1);

            this.mouseDeltaX = 0;
            this.mouseDeltaY = 0;

            this.lat = Math.max(-85, Math.min(85, this.lat));
            this.phi = (90 - this.lat) * Math.PI / 180;
            this.theta = this.lon * Math.PI / 180;

            if(this.constrainVertical) {
                this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
            }

            this.target.x = this.camera.position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
            this.target.y = this.camera.position.y + 100 * Math.cos(this.phi);
            this.target.z = this.camera.position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

            this.camera.lookAt(this.target);
        }
    });

    return Controls;
});