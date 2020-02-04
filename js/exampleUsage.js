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

// We can also pass custom Canvas Context if we want to draw to a different canvas.
const customContext = document.getElementById('myCanvas').getContext('2d');
var emit2 = jmParticleEngine.generateEmitter(Math.ceil(window.innerWidth / 4), Math.ceil(window.innerHeight / 2), 5000, particleGenerator2, customContext);

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
