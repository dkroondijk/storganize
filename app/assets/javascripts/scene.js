$(document).ready(function(){

  // div that contains the renderer
  var myCanvas = $('#my-canvas')

  var scene = new THREE.Scene(),
      raycaster = new THREE.Raycaster(),
      mouse = new THREE.Vector2(),
      objects = [],
      cubes = [],
      SELECTED,
      NTERSECTED;

  // Define scene and camera
  var camera = new THREE.PerspectiveCamera( 45, myCanvas.innerWidth() / myCanvas.innerHeight(), 1, 10000 );
  camera.position.set( 250, 400, 650 );
  camera.lookAt( new THREE.Vector3() );

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


  // Lighting
  var ambientLight = new THREE.AmbientLight( 0x0c0c0c );
  scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  scene.add( directionalLight );


  // Initialize grid and plane
  var initialize = function() {

    var lockerName = $('#my-canvas').data('locker').name
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

    plane = new THREE.Mesh( geometry );
    plane.visible = false;
    scene.add( plane );
    objects.push( plane );

    var lockerBoxes = storganize.locker.boxes;

    for(var i = 0; i < lockerBoxes.length; i += 1) {
      addCube(newCube(lockerBoxes[i].name, lockerBoxes[i].x, lockerBoxes[i].y, lockerBoxes[i].z))
    }

  };

  $('#new_box').submit(function(event){
    event.preventDefault();

    var cube = newCube($("#box_name").val(), 25, 25, 25);
    addCube(cube);
    // addCube(newCube(1, 25, 25, 25));

    var data = {};
    data["box"] = {};
    data["box"]["x"] = cube.position.x;
    data["box"]["y"] = cube.position.y;
    data["box"]["z"] = cube.position.z;
    data["box"]["name"] = cube.name;

    var locker_id = $('#my-canvas').data('locker').id;
    $.post('/lockers/'+locker_id+'/boxes/', data, function(){
      $.get('/lockers/'+locker_id);
    });

  });

  var newCube = function(name, x, y, z) {
    var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
    var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xdeae66 } );
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    // cube.name = $("#box_name").val();
    cube.name = name;
    cube.unique_id = "blah";

    return cube;
  }

  // Define 'add cube' function
  var addCube = function(cube) {
    
    scene.add( cube );
    objects.push(cube);
    cubes.push(cube);
  };


  // define render/animation loop
  var animate = function() {
    requestAnimationFrame( animate );
    render();
  };

  var render = function () {
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
      // console.log(SELECTED);
      // myCanvas.style.cursor = 'move';
    }

    render();
  };

  function onDocumentMouseUp(event) {
    event.preventDefault();

    SELECTED.material.color.setHex(0xdeae66);
    // console.log(SELECTED);

    var data = {};
    data["box"] = {};
    data["box"]["x"] = SELECTED.position.x;
    data["box"]["y"] = SELECTED.position.y;
    data["box"]["z"] = SELECTED.position.z;

    console.log(SELECTED);

    var lockerBoxes = storganize.locker.boxes;
    var locker_id = storganize.locker.id;

    for (var i = 0; i < lockerBoxes.length; i += 1) {
      if (lockerBoxes[i].name === SELECTED.name){
        var id = lockerBoxes[i].id;
      }
    }

    $.ajax({
      url: '/lockers/'+locker_id+'/boxes/' + id,
      method: 'put',
      data: data,
    });

    SELECTED = null;

  };


  // Highlight cube when box is clicked in list on page
  $('.well').click(function(){
    for (var i = 0; i < objects.length; i += 1) {      
      if(objects[i].id === $(this).data('box').cube_id) {
        objects[i].material.color.setHex(0xff0000);
      }
    }
  });

  
  initialize();

  // call animation loop
  animate();
});



