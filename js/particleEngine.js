/*********************************************************************
*  #### Simple Particle Engine v3.0 (Work in progress!) ####
*  Coded by Jason Mayes 2014. www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here:
*  https://plus.google.com/+JasonMayes/posts
 * Updates will be posted to this site:
 * http://www.jasonmayes.com/projects/particleEngine/
 * Or see Github:
 * https://github.com/jasonmayes/Particle-Engine
*********************************************************************/

// Polyfill for requestAnimationFrame.
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


/* The magical particle engine! */
var jmParticleEngine = function() {
  // Reference to the canvas DOM element.
  var canvas = null;

  // Hold canvas context.
  var ctx = null;

  // Hold all emitters.
  var emitters = [];

  /**
   * A class which allows us to create Particle instances.
   * @param {Number} x Starting x co-ordinate of the particle.
   * @param {Number} y Starting y co-ordinate of the particle.
   * @param {Number} w Width of particle.
   * @param {Number} h Height of particle.
   * @param {Number} rot Rotation in radians of the particle.
   * @param {Number} xVel Velocity in the x direction.
   * @param {Number} yVel Velocity in the y direction.
   * @param {Number} life How long will the particle last for in animation frames.
   * @param {Number} s How will particle size change with life? 0 = no change,
   *    1 = smaller, 2 = larger. Taken as a % of width / height.
   * @param {Number} r The amount of red in the particle (0 - 255).
   * @param {Number} g The amount of green in the particle (0 - 255).
   * @param {Number} b The amount of blue in the particle (0 - 255).
   * @param {Number} i Optional. The index of a preloaded image we wish to
   *     render.
   */
  function Particle(x, y, w, h, rot, xVel, yVel, life, s, r, g, b, i) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.rotation = rot;
    this.xVelocity = xVel;
    this.yVelocity = yVel;
    this.maxLife = life;
    this.life = life;
    this.growthType = s;
    this.r = r;
    this.g = g;
    this.b = b;
    this.image = i;
  }

  /**
   * A class which allows us to create Emitters of particles.
   * @param {Number} x The x co-ordinate of the emitter location.
   * @param {Number} y The y co-ordinate of the emitter location.
   * @param {Number} m  Enforce a hard limit on the number of displayable
   *    particles at any given time. Default is 500.
   * @param {Function} p Particle generator function which returns a new particle.
   * @param {CanvasRenderingContext2D=} ctx Optional. The canvas context we want to render to.
   */
  function Emitter(x, y, m, p, ctx_) {
    this.ctx = ctx || ctx_;
    this.x = x;
    this.y = y;
    this.maxParticles = m || 500;
    // Array to hold all particles we have generated for this emitter.
    this.particles = [];
    this.generateParticle = p;
    this.emit = false;
    this.images = [];
  }

  Emitter.prototype.start = function() {
    this.emit = true;
  };

  Emitter.prototype.stop = function() {
    this.emit = false;
  };
  
  Emitter.prototype.fetchCtx = function() {
    return this.ctx;
  };

  Emitter.prototype.preloadImage = function(url) {
    var img = new Image();
    var that = this;
    var id = this.images.length;
    that.images.push({"image": img, "loaded": false});
    this.attachHandler(img, 'load', function() {
      that.images[id].loaded = true;
    });
    img.crossOrigin = '';
    img.src = url;
    return id;
  };

  Emitter.prototype.attachHandler = attachHandler_;

  /**
   * Cross browser attach event handler.
   * @param {String | Object} elementId ID of the DOM element we wish to attach
   *     event to. Alternatively can pass the object itself.
   * @param {String} event The type of event to listen for eg 'click'.
   * @param {Function} functionName The function to be attached to the event.
   */
  function attachHandler_(elementId, event, functionName) {
    var element = {};
    if (typeof elementId === 'string') {
      element = document.getElementById(elementId);
    } else {
      element = elementId;
    }
    if (element.addEventListener) {
      element.addEventListener(event, functionName, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, functionName);
    } else {
      element['on' + event] = functionName;
    }
  }

  /**
   * Generate a random number from 0 to (n - s).
   * @param {Number} n The highest number we wish to generate numbers to.
   * @param {Number} s Optional: A number to be subtracted from the resulting
   *    random number. This allows us to generate negative numbers.
   * @param {Boolean} r If true, rounds the generated number to whole number.
   *    Else it is a double.
   */
  function randomNumber_(n, s, r) {
    if (n === undefined) {
      n = 1;
    }
    if (s === undefined) {
      s = 0;
    }
    if (r === undefined) {
      r = true;
    }
    if (r) {
      return Math.round((Math.random() * n) - s);
    } else {
      return (Math.random() * n) - s;
    }
  }

  /**
   * A function to actually draw the particle to the screen once the context
   * and other parameters have been set up.
   * @param {Particle} particle The particle we wish to draw.
   * @param {Number} width The calculated width of the particle at a given point in life.
   * @param {Number} height The calculated height of the particle at a given point in life.
   * @param {Image} image Optional. The image we wish to draw as the particle. If no image specified we draw a rectangle instead.
   */
  function renderParticle(canvasCtx, particle, width, height, image) {
    // Only rotate if rotation is applied.
    if (particle.rotation !== 0) {
      // Save context so we can revert to it later.
      canvasCtx.save();
      // Move to where we want to draw our image.
      canvasCtx.translate(particle.x, particle.y);
      // Rotate around that point.
      canvasCtx.rotate(particle.rotation);

      if (image !== undefined) {
        // Draw the image about its centre.
        canvasCtx.drawImage(image, -width / 2, -height / 2, width, height);
      } else {
        // Draw rectangle.
        canvasCtx.fillRect(-width / 2, -height / 2, width, height);
      }
      // Restore context to how it was before.
      canvasCtx.restore();
    } else {
      if (image !== undefined) {
        // Draw the image about its centre.
        canvasCtx.drawImage(image, particle.x, particle.y, width, height);
      } else {
        // Draw rectangle.
        canvasCtx.fillRect(particle.x, particle.y, width, height);
      }
    }
  }

  /**
   * Our main animation loop to update each particle's state and redraw the scene.
   * @param {Number} time The epoch time passed by the browser from the
   *    requestAnimationFrame request.
   */
  function particleLoop(time) {
    // Now lets iterate through all emitters.
    var n = emitters.length;
    // Avoid re-declaring width and height tmp vars.
    var width = 0;
    var height = 0;

    while (n--) {
      // Clear the canvas.
      emitters[n].fetchCtx().clearRect(0, 0, canvas.width, canvas.height);
      // Ensure we uphold maximum particle count.
      if (emitters[n].particles.length === emitters[n].maxParticles) {
        emitters[n].particles.shift();
      }
      // Only generate new particles if emitter is turned on.
      if (emitters[n].emit) {
        // Generate a new particle and push it to our particles array.
        var diff = emitters[n].maxParticles - emitters[n].particles.length;
        var wanted = Math.ceil(diff * 0.01);
        if (diff > 0) {
          var j = 0;
          while (j < wanted) {
            emitters[n].particles.push(emitters[n].generateParticle());
            j++;
          }
        }
      }
      // Now lets iterate through all particles and draw them all in the next time step.
      var i = emitters[n].particles.length;
      while (i--) {
        // Check to see if particle has died.
        if (emitters[n].particles[i].life > 0) {
          // Define how particle size changes with life.
          if (emitters[n].particles[i].growthType === 1) {
            // Decrease size with life of particle.
            width = (emitters[n].particles[i].life / emitters[n].particles[i].maxLife) * emitters[n].particles[i].width;
            height = (emitters[n].particles[i].life / emitters[n].particles[i].maxLife) * emitters[n].particles[i].height;
          } else if (emitters[n].particles[i].growthType === 2) {
            // Increase size with life of particle.
            width = (1 - (emitters[n].particles[i].life / emitters[n].particles[i].maxLife)) * emitters[n].particles[i].width;
            height = (1 - (emitters[n].particles[i].life / emitters[n].particles[i].maxLife)) * emitters[n].particles[i].height;
          } else {
            // No effect with life - same size throughout.
            width = emitters[n].particles[i].width;
            height = emitters[n].particles[i].height;
          }

          // If we are not trying to render an image particle then draw rectangle.
          if (emitters[n].particles[i].image === undefined) {
            emitters[n].fetchCtx().fillStyle = 'rgba(' + emitters[n].particles[i].r + ',' + emitters[n].particles[i].g + ',' + emitters[n].particles[i].b + ', 1)';
            emitters[n].fetchCtx().globalAlpha = (emitters[n].particles[i].life / emitters[n].particles[i].maxLife);
            // Render particle as rectangle.
            renderParticle(emitters[n].fetchCtx(), emitters[n].particles[i], width, height);
          } else {
            // Otherwise lets ensure image has been defined and loaded and draw it.
            if (emitters[n].images[emitters[n].particles[i].image] !== undefined) {
              if (emitters[n].images[emitters[n].particles[i].image].loaded) {
                emitters[n].fetchCtx().globalAlpha = (emitters[n].particles[i].life / emitters[n].particles[i].maxLife);
                // Render particle as image.
                renderParticle(emitters[n].fetchCtx(), emitters[n].particles[i], width, height, emitters[n].images[emitters[n].particles[i].image].image);
              }
            }
          }
          // Update particle properties for next cycle.
          emitters[n].particles[i].x += emitters[n].particles[i].xVelocity;
          emitters[n].particles[i].y += emitters[n].particles[i].yVelocity;
          emitters[n].particles[i].life--;
        } else {
          // If dead, remove it.
          emitters[n].particles.splice(i, 1);
        }
      }
    }
    requestAnimationFrame(particleLoop, canvas);
  }

  // Publicly accessible functions exposed to users.
  return {
    /**
     * Initiate and run the particle engine.
     * @param {String} canvasId The DOM id of the canvas element we shall be rendering to.
     * @param {Number} width Width of canvas.
     * @param {Number} height Height of canvas.
     */
    init: function(canvasId, width, height) {
      canvas = document.getElementById(canvasId);
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      particleLoop();
    },

    /**
     * Allow external users to generate new emitters.
     * @param {Number} x The x co-ordinate of the emitter location.
     * @param {Number} y The y co-ordinate of the emitter location.
     * @param {Number} m  Enforce a hard limit on the number of displayable
     *    particles at any given time. Default is 500.
     * @param {Function} p Particle generator function to use which returns new particles.
     */
    generateEmitter: function(x, y, m, p) {
      return new Emitter(x, y, m, p);
    },

    /**
     * Allow external users to generate new particles.
     * @param {Number} x Starting x co-ordinate of the particle.
     * @param {Number} y Starting y co-ordinate of the particle.
     * @param {Number} w Width of particle.
     * @param {Number} h Height of particle.
     * @param {Number} rot Rotation in radians of the particle.
     * @param {Number} xVel Velocity in the x direction.
     * @param {Number} yVel Velocity in the y direction.
     * @param {Number} life How long will the particle last for in animation frames.
     * @param {Number} s How will particle size change with life? 0 = no change,
     *    1 = smaller, 2 = larger. Taken as a % of width / height.
     * @param {Number} r The amount of red in the particle (0 - 255).
     * @param {Number} g The amount of green in the particle (0 - 255).
     * @param {Number} b The amount of blue in the particle (0 - 255).
     * @param {Number} i Optional. The index of a preloaded image we wish to
     *     render.
     */
    generateParticle: function(x, y, w, h, rot, xVel, yVel, life, s, r, g, b, i) {
      return new Particle(x, y, w, h, rot, xVel, yVel, life, s, r, g, b, i);
    },

    /**
     * Add an emitter to the engine and start it.
     * @param {jmParticleEngine.Emitter} e The emitter we wish to add to the engine.
     */
    addEmitter: function(e, s) {
      if (s !== undefined && s) {
        e.start();
      }
      emitters.push(e);
    },

    /**
     * Publicly expose the randomNumber generator.
     * @param {Number} n The highest number we wish to generate numbers to.
     * @param {Number} s Optional: A number to be subtracted from the resulting random number.
     *    This allows us to generate negative numbers.
     * @param {Boolean} r If true, rounds the generated number to whole number.
     *    Else it is a double.
     */
    randomNumber: randomNumber_,

    /**
     * Publicly expose cross browser attach event handler.
     * @param {String} elementId ID of the DOM element we wish to attach event to.
     * @param {String} event The type of event to listen for eg 'click'.
     * @param {Function} functionName The function to be attached to the event.
     */
    attachHandler: attachHandler_
  };
}();




/* Lets use this sweet engine! Example usage below! */

// Initiate engine to draw to DOM canvas with id "myCanvas" and detail its dimensions.
jmParticleEngine.init('myCanvas', window.innerWidth, window.innerHeight);

// Define a particle generators - each generates particles of one particle type.
function particleGenerator1() {
  var size = jmParticleEngine.randomNumber(2, undefined, true);
  // Note context of this is bound to the emitter calling the function,
  // so we can simply grab the emitter's x and y for its starting point.
  return jmParticleEngine.generateParticle(
      // Start at the emitter's x co-ordinate.
      this.x,
      // Start at the emitter's y co-ordinate.
      this.y,
      // Width.
      size,
      // Height.
      size,
      // Rotation.
      0,
      // xVelocity.
      jmParticleEngine.randomNumber(15, 7.5, false),
      // yVelocity.
      jmParticleEngine.randomNumber(15, 7.5, false),
      // Life.
      120,
      // How will particle change size vs life.
      // 0 - no change, same size always.
      // 1 - smaller with age.
      // 2 - larger with age.
      0,
      // Red.
      jmParticleEngine.randomNumber(191, -64, true),
      // Green.
      jmParticleEngine.randomNumber(191, -64, true),
      // Blue.
      jmParticleEngine.randomNumber(191, -64, true)
  );
}

function particleGenerator2() {
  var size = jmParticleEngine.randomNumber(20, undefined, true);
  // Note context of this is bound to the emitter calling the function,
  // so we can simply grab the emitter's x and y for its starting point.
  return jmParticleEngine.generateParticle(
      // Start at the emitter's x co-ordinate.
      this.x,
      // Start at the emitter's y co-ordinate.
      this.y,
      // Width.
      size,
      // Height.
      size,
      // Rotation.
      0,
      // xVelocity.
      jmParticleEngine.randomNumber(15, 7.5, false),
      // yVelocity.
      jmParticleEngine.randomNumber(15, 7.5, false),
      // Life.
      64,
      // How will particle change size vs life.
      // 0 - no change, same size always.
      // 1 - smaller with age.
      // 2 - larger with age.
      0,
      // Red.
      jmParticleEngine.randomNumber(255, 0, true),
      // Green.
      jmParticleEngine.randomNumber(64, 0, true),
      // Blue.
      jmParticleEngine.randomNumber(32, 0, true)
  );
}

function particleGenerator3() {
  var size1 = jmParticleEngine.randomNumber(3, undefined, true);
  var size2 = jmParticleEngine.randomNumber(100, undefined, true);
  // Note context of this is bound to the emitter calling the function,
  // so we can simply grab the emitter's x and y for its starting point.
  return jmParticleEngine.generateParticle(
      // Start at the emitter's x co-ordinate.
      this.x +  jmParticleEngine.randomNumber(1000, 500, false),
      // Start at the emitter's y co-ordinate.
      this.y,
      // Width.
      size1,
      // Height.
      size2,
      // Rotation.
      0,
      // xVelocity.
      jmParticleEngine.randomNumber(1, 1, false),
      // yVelocity.
      jmParticleEngine.randomNumber(30, 0, false),
      // Life.
      60,
      // How will particle change size vs life.
      // 0 - no change, same size always.
      // 1 - smaller with age.
      // 2 - larger with age.
      1,
      // Red.
      jmParticleEngine.randomNumber(32, 0, true),
      // Green.
      jmParticleEngine.randomNumber(50, 0, true),
      // Blue.
      jmParticleEngine.randomNumber(255, 0, true)
  );
}

function particleGenerator4() {
  var size = jmParticleEngine.randomNumber(128, undefined, true);
  var grey = jmParticleEngine.randomNumber(255, 0, true);
  // Note context of this is bound to the emitter calling the function,
  // so we can simply grab the emitter's x and y for its starting point.
  return jmParticleEngine.generateParticle(
      // Start at the emitter's x co-ordinate.
      this.x,
      // Start at the emitter's y co-ordinate.
      this.y,
      // Width.
      size,
      // Height.
      size,
      // Rotation.
      0,
      // xVelocity.
      jmParticleEngine.randomNumber(15, 7.5, false),
      // yVelocity.
      jmParticleEngine.randomNumber(15, 7.5, false),
      // Life.
      42,
      // How will particle change size vs life.
      // 0 - no change, same size always.
      // 1 - smaller with age.
      // 2 - larger with age.
      0,
      // Red.
      grey,
      // Green.
      grey,
      // Blue.
      grey
  );
}

function particleGenerator5() {
  var size = jmParticleEngine.randomNumber(128, -64, true);
  // Note context of this is bound to the emitter calling the function,
  // so we can simply grab the emitter's x and y for its starting point.
  return jmParticleEngine.generateParticle(
      // Start at the emitter's x co-ordinate.
      this.x ,
      // Start at the emitter's y co-ordinate.
      this.y ,
      // Width.
      size,
      // Height.
      size,
      // Rotation.
      jmParticleEngine.randomNumber(Math.PI * 2, 0, false),
      // xVelocity.
      jmParticleEngine.randomNumber(18, 9, false),
      // yVelocity.
      jmParticleEngine.randomNumber(18, 9, false),
      // Life.
      64,
      // How will particle change size vs life.
      // 0 - no change, same size always.
      // 1 - smaller with age.
      // 2 - larger with age.
      0,
      // Red.
      0,
      // Green.
      0,
      // Blue.
      0,
      // If we wish to use a preloaded image, specify index here.
      0
  );
}

// Generate emitters using the particle generator function defined above.
var emit1 = jmParticleEngine.generateEmitter(Math.ceil(window.innerWidth / 4), Math.ceil(window.innerHeight / 2), 1500, particleGenerator5);
emit1.preloadImage('https://storage.googleapis.com/jm-cors/images/fire2.png');

var emit2 = jmParticleEngine.generateEmitter(Math.ceil(window.innerWidth / 4), Math.ceil(window.innerHeight / 2), 5000, particleGenerator2);

var emit3 = jmParticleEngine.generateEmitter(Math.ceil(window.innerWidth / 4), Math.ceil(window.innerHeight / 2), 5000, particleGenerator3);

var emit4 = jmParticleEngine.generateEmitter(Math.ceil(window.innerWidth / 4), Math.ceil(window.innerHeight / 2), 5000, particleGenerator4);

var emit5 = jmParticleEngine.generateEmitter(Math.ceil(window.innerWidth / 4), Math.ceil(window.innerHeight / 2), 5000, particleGenerator1);

var emitTmp = jmParticleEngine.generateEmitter(Math.ceil((window.innerWidth / 4) * 3), Math.ceil(window.innerHeight / 2), 750, particleGenerator1);

// Add emitters to engine! Ensure emit1 and emitTmp start
// straight away.
jmParticleEngine.addEmitter(emit1, true);
jmParticleEngine.addEmitter(emit2);
jmParticleEngine.addEmitter(emit3);
jmParticleEngine.addEmitter(emit4);
jmParticleEngine.addEmitter(emit5);
jmParticleEngine.addEmitter(emitTmp, true);

// Attach emitters 1, 2, 3 and 4 to mouse position.
jmParticleEngine.attachHandler('myCanvas', 'mousemove', function(e){
  if (!e) {
    e = window.event;
  }
  emit1.x = e.clientX;
  emit1.y = e.clientY;
  emit2.x = e.clientX;
  emit2.y = e.clientY;
  emit3.x = e.clientX;
  emit3.y = e.clientY;
  emit4.x = e.clientX;
  emit4.y = e.clientY;
  emit5.x = e.clientX;
  emit5.y = e.clientY;
});

// Stop the second emitter after 5 seconds.
setTimeout(function(){
  emitTmp.stop();
}, 5000);


// Event listener for changing particle effect dropdown.
jmParticleEngine.attachHandler('changer', 'change', function(e){
  if (!e) {
    e = window.event;
  }
  var sel = document.getElementById('changer');
  var val = sel[sel.selectedIndex].value;
  emit1.stop();
  emit2.stop();
  emit3.stop();
  emit4.stop();
  emit5.stop();
  if (val === '1') {
    emit1.start();
  } else if (val === '2') {
    emit2.start();
  } else if (val === '3') {
    emit3.start();
  } else if (val === '4') {
    emit4.start();
  } else if (val === '5') {
    emit5.start();
  }
});
