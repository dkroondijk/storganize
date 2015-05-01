$(document).ready(function(){

  var token = $('meta[name="csrf-token"]').attr('content');

  $.ajaxSetup({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-CSRF-Token', token);
    }
  }); 

  var myCanvas = $('#my-canvas')

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  // var objects = [];

  // Define scene and camera cube test >>>>>>>>>>>>>>>>>
  // var scene = new THREE.Scene();
  // var camera = new THREE.PerspectiveCamera( 45, myCanvas.innerWidth()/myCanvas.innerHeight(), 0.1, 1000 );
  // camera.position.set(5, 0, 30)
  // camera.lookAt(new THREE.Vector(1, 1, 50));

  // Define scene and camera locker view >>>>>>>>>>>>>>>
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 45, myCanvas.innerWidth() / myCanvas.innerHeight(), 1, 10000 );
  camera.position.set( 250, 400, 650 );
  camera.lookAt( new THREE.Vector3() );

  // Define renderer cube test >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // var renderer = new THREE.WebGLRenderer();
  // renderer.setSize( myCanvas.innerWidth(), myCanvas.innerHeight() );
  // renderer.setClearColor( 0xf0f0f0 );
  // myCanvas.append( renderer.domElement );

  // Define renderer locker view >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( myCanvas.innerWidth(), myCanvas.innerHeight() );
  renderer.setClearColor( 0xf0f0f0 );
  myCanvas.append( renderer.domElement );
  // renderer.setPixelRatio( window.devicePixelRatio );

  // grid
  var lockerLength = $('#my-canvas').data('locker').length
  var lockerWidth = $('#my-canvas').data('locker').width

  var gridLength = lockerLength * 25, step = 50;
  var gridWidth = lockerWidth * 25, step = 50;

  var gridGeometry = new THREE.Geometry();

  for ( var i = -gridWidth; i <= gridWidth; i += step ) {

    gridGeometry.vertices.push( new THREE.Vector3( i, 0, - gridLength ) );
    gridGeometry.vertices.push( new THREE.Vector3( i, 0,   gridLength ) );
  }

  for ( var i = - gridLength; i <= gridLength; i += step ) {

    gridGeometry.vertices.push( new THREE.Vector3( - gridWidth, 0, i ) );
    gridGeometry.vertices.push( new THREE.Vector3(   gridWidth, 0, i ) );
  }


  var gridMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

  var line = new THREE.Line( gridGeometry, gridMaterial, THREE.LinePieces );
  scene.add( line );

  var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

  var plane = new THREE.Mesh( geometry );
  plane.visible = false;
  scene.add( plane );

  // objects.push( plane );

  // Define cube geometry and material
  var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
  var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0xdeae66 } );
  var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

  // Define 'add cube' function
  var addCube = function() {
    var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
    var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xdeae66 } );
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    window.cube = cube;
    var box_id = cube.id

    // cube.position.x = Math.floor((Math.random() * 10) + 1);
    // cube.position.y = Math.floor((Math.random() * 10) + 1);
    
    cube.position.x = -5;
    cube.position.y = 5;

    scene.add( cube );

    // $.post('/boxes', {name: 'box'+box_id, x: 2, y: 2, z: 2})
  }
  
  // addCube button
  $('#add-cube-btn').click(function(){
    addCube();
  });

  // Define scene lighting cube test >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // var light = new THREE.PointLight( 0xFFFF00 );
  // light.position.set( 10, 0, 10 );
  // scene.add( light );

  // Lighting locker view >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  var ambientLight = new THREE.AmbientLight( 0x606060 );
  scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  scene.add( directionalLight );

  // define render/animation loop
  var render = function () {
    requestAnimationFrame( render );

    // scene.traverse(function(e) {
    //   if (e instanceof THREE.Mesh) {
    //     e.rotation.x += 0.02;
    //     e.rotation.y += 0.02;        
    //   }
    // });

    renderer.render(scene, camera);
  };

  // call render loop
  render();


  function onDocumentMouseDown( event ) {

    event.preventDefault();
    mouse.set( ( event.clientX / myCanvas.innerWidth ) * 2 - 1, - ( event.clientY / myCanvas.innerHeight ) * 2 + 1 );
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {

      var intersect = intersects[ 0 ];

      // drag cube
      } else {


      }
      render();
    }

});


// t.text array: true default: []
// t.string array: true default: []


