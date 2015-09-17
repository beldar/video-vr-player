if ( ! Detector.webgl ) {
    console.log('No WebGL');
    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";

}

var renderer	= new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var updateFcts	= [];

var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
camera.position.z = 3;

var winResize   = new THREEx.WindowResize(renderer, camera);
var effect = new THREE.OculusRiftEffect( renderer, {
    //1920x1080
    worldFactor: 10,
    HMD : {
        hResolution: window.innerWidth,
        vResolution: window.innerHeight,
        hScreenSize: 0.14976,
        vScreenSize: 0.0936,
        interpupillaryDistance: 0.0805,
        lensSeparationDistance: 0.0805,
        eyeToScreenDistance: 0.041,
        distortionK : [1.0, 0.22, 0.24, 0.0],
        chromaAbParameter: [ 0.996, -0.004, 1.014, 0.0]
    }
});


//////////////////////////////////////////////////////////////////////////////////
//		add an object and make it move					//
//////////////////////////////////////////////////////////////////////////////////

// create the videoTexture
// create the video element
video = document.getElementById( 'video' );
video.src = "video/earth.mp4";
video.setAttribute('crossorigin', 'anonymous');
video.load(); // must call after setting/changing source

//On tap, go fullscreen and start playing the video
var start = function(){
    document.getElementById('start').style.display = 'none';
    var
    el = document.documentElement
    , rfs =
        el.requestFullScreen
    || el.webkitRequestFullScreen
    || el.mozRequestFullScreen
    ;
    rfs.call(el);
    effect.setSize( window.innerWidth, window.innerHeight );
    video.play();
    requestAnimationFrame(animate);
};
document.addEventListener('touchstart', start);
document.addEventListener('click', start);

var videoTexture = new THREE.Texture( video );
var geometry	= new THREE.PlaneGeometry( 10, 10 );
var material = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
var mesh	= new THREE.Mesh( geometry, material );
scene.add( mesh );



//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
/*var mouse	= {x : 0, y : 0}
document.addEventListener('mousemove', function(event){
    mouse.x	= (event.clientX / window.innerWidth ) - 0.5
    mouse.y	= (event.clientY / window.innerHeight) - 0.5
}, false)
updateFcts.push(function(delta, now){
    camera.position.x += (mouse.x*5 - camera.position.x) * (delta*3)
    camera.position.y += (mouse.y*5 - camera.position.y) * (delta*3)
    camera.lookAt( scene.position )
})*/


//////////////////////////////////////////////////////////////////////////////////
//		render the scene						//
//////////////////////////////////////////////////////////////////////////////////
updateFcts.push(function(){
    //renderer.render( scene, camera );
    effect.render( scene, camera );
})

//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
var lastTimeMsec = null;
function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );
    // measure time
    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
    var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec	= nowMsec;

    if ( videoTexture )
        videoTexture.needsUpdate = true;
    // call each update function
    updateFcts.forEach(function(updateFn){
        updateFn(deltaMsec/1000, nowMsec/1000)
    });
}
