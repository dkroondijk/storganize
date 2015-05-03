$(document).ready(function(){

  var token = $('meta[name="csrf-token"]').attr('content');

  $.ajaxSetup({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('X-CSRF-Token', token);
    }
  }); 

  // div that contains the renderer
  var myCanvas = $('#my-canvas')

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var objects = [];
  var offset = new THREE.Vector3();
  var SELECTED;
  var INTERSECTED;

  // Define scene and camera
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 45, myCanvas.innerWidth() / myCanvas.innerHeight(), 1, 10000 );
  camera.position.set( 250, 400, 650 );
  camera.lookAt( new THREE.Vector3() );

  // Define renderer
  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( myCanvas.innerWidth(), myCanvas.innerHeight() );
  renderer.setClearColor( 0xf0f0f0 );
  myCanvas.append( renderer.domElement );

  // renderer.setPixelRatio( window.devicePixelRatio );
  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

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

  var geometry = new THREE.PlaneBufferGeometry( 500, 500 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

  var plane = new THREE.Mesh( geometry );
  plane.visible = true;
  scene.add( plane );
  objects.push( plane );

  // Define 'add cube' function
  var addCube = function() {
    var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
    var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xdeae66 } );
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    window.cube = cube;
    var box_id = cube.id

    cube.position.x = Math.floor((Math.random() * 10) * 25);
    cube.position.z = Math.floor((Math.random() * 10) * 25);
    cube.position.y = 25;
    
    // cube.position.x = 0;
    // cube.position.y = 25;
    // cube.position.z = 25;

    scene.add( cube );
    objects.push(cube);
    console.log(objects);
    // $.post('/boxes', {name: 'box'+box_id, x: 2, y: 2, z: 2})
  }
  
  // addCube button
  $('#add-cube-btn').click(function(){
    addCube();
  });

  // Lighting
  var ambientLight = new THREE.AmbientLight( 0x606060 );
  scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  scene.add( directionalLight );

  // define render/animation loop
  var animate = function() {
    requestAnimationFrame( animate );
    render();
  };

  var render = function () {

    // scene.traverse(function(e) {
    //   if (e instanceof THREE.Mesh) {
    //     e.rotation.x += 0.02;
    //     e.rotation.y += 0.02;        
    //   }
    // });

    renderer.render(scene, camera);
  };

  function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse.x = ( ( event.clientX - 70 ) / renderer.domElement.width ) * 2 - 1; 
    mouse.y = - ( ( event.clientY - 50 ) / renderer.domElement.height ) * 2 + 1;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    if (SELECTED) {
      var intersects = raycaster.intersectObject(plane);
      SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
      return;
    }

    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length >  0) {
      INTERSECTED = intersects[0].object;
      // plane.position.copy(INTERSECTED.position);
    //   plane.lookAt(camera.position);
    }

    render();
  };


  function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = ( ( event.clientX - 70 ) / renderer.domElement.width ) * 2 - 1; 
    mouse.y = - ( ( event.clientY - 50 ) / renderer.domElement.height ) * 2 + 1;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    // var intersects = raycaster.intersectObjects(objects);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0 && intersects[0] != plane) {

      // intersects[0].object.material.transparent = true;
      // intersects[0].object.material.opacity = 0.1;
      intersects[0].object.material.color.setHex(0xff0000);

      SELECTED = intersects[ 0 ].object;
      var intersects = raycaster.intersectObject( plane );
      offset.copy( intersects[ 0 ].point ).sub( plane.position );

      // myCanvas.style.cursor = 'move';
    }
    // call render loop
    render();
  };

  function onDocumentMouseUp(event) {
    event.preventDefault();

    SELECTED = null;

    // if ( INTERSECTED ) {
    //   plane.position.copy( INTERSECTED.position );
    //   SELECTED = null;
    // }

  };
  
  // call render loop
  animate();
});



