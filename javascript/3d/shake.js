//简单的摇一摇触发代码
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', shake, false);
}
var speed = 30; 
var x = y = z = lastX = lastY = lastZ = 0;

function shake(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    x = acceleration.x;
    y = acceleration.y;
    z = acceleration.z;
    if (Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed || Math.abs(z - lastZ) > speed) {
       console.log('you are shaking')
    }
    lastX = x;
    lastY = y;
    lastZ = z;
}