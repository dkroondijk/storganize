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
  // camera.lookAt( scene.position );

  // Define renderer
  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( myCanvas.innerWidth(), myCanvas.innerHeight() );
  renderer.setClearColor( 0xf0f0f0 );
  myCanvas.append( renderer.domElement );

  var leftMargin = renderer.domElement.getBoundingClientRect().left;
  var topMargin = renderer.domElement.getBoundingClientRect().top;

  // renderer.setPixelRatio( window.devicePixelRatio );
  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );


  // grid
  var lockerLength = $('#my-canvas').data('locker').length
  var lockerWidth = $('#my-canvas').data('locker').width

  var gridLength = lockerLength * 25, step = 50;
  var gridWidth = lockerWidth * 25, step = 50;

  var gridLengthModulus = gridLength % 50;
  var gridWidthModulus = gridWidth % 50;

  var gridGeometry = new THREE.Geometry();

  for ( var i = -gridWidth - gridWidthModulus; i <= gridWidth - gridWidthModulus; i += step ) {

    gridGeometry.vertices.push( new THREE.Vector3( i, 0, - gridLength - gridLengthModulus ) );
    gridGeometry.vertices.push( new THREE.Vector3( i, 0,   gridLength - gridLengthModulus ) );
  }

  for ( var i = -gridLength - gridLengthModulus; i <= gridLength - gridLengthModulus; i += step ) {

    gridGeometry.vertices.push( new THREE.Vector3( - gridWidth - gridWidthModulus, 0, i ) );
    gridGeometry.vertices.push( new THREE.Vector3(   gridWidth - gridWidthModulus, 0, i ) );
  }

  var gridMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

  var line = new THREE.Line( gridGeometry, gridMaterial, THREE.LinePieces );
  scene.add( line );

  var geometry = new THREE.PlaneBufferGeometry( 500, 500 );
  // rotate plane from vertical to horizontal about x-axis
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

    mouse.x = ( ( event.clientX - leftMargin ) / renderer.domElement.width ) * 2 - 1; 
    mouse.y = - ( ( event.clientY - topMargin ) / renderer.domElement.height ) * 2 + 1;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    if (SELECTED) {

      var intersects = raycaster.intersectObjects(objects);

      if (intersects.length > 1) {
        var intersect = intersects[1];
        console.log(intersect);
        SELECTED.position.copy( intersect.point ).add(intersect.face.normal);
        SELECTED.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        return;        
      } else {
        var intersects = raycaster.intersectObject(plane);
        var intersect = intersects[0];
        SELECTED.position.copy( intersect.point ).add(intersect.face.normal);
        SELECTED.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        return;
      }
    }

    render();
  };


  function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = ( ( event.clientX - leftMargin ) / renderer.domElement.width ) * 2 - 1; 
    mouse.y = - ( ( event.clientY - topMargin ) / renderer.domElement.height ) * 2 + 1;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5);
    vector = vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(objects);
    var intersect = intersects[0];

    if (intersects.length > 0 && intersect.object != plane) {
      
      intersect.object.material.color.setHex(0xff0000);

      SELECTED = intersect.object;
      // myCanvas.style.cursor = 'move';
    }

    render();
  };

  function onDocumentMouseUp(event) {
    event.preventDefault();

    SELECTED.material.color.setHex(0xdeae66);
    SELECTED = null;

  };
  
  // call animation loop
  animate();
});



