$(document).ready(function(){

  var raycaster = new THREE.Raycaster(),
      mouse = new THREE.Vector2(),
      scene = new THREE.Scene(),
      myCanvas = $('#my-canvas'),
      objects = [],
      cubes = [], // a cube is defined by cubeGeometry and cubeMaterial
      SELECTED,
      INTERSECTED;

  // Define scene and camera
  var camera = new THREE.PerspectiveCamera( 45, myCanvas.innerWidth() / myCanvas.innerHeight(),1 );
  camera.position.set( 500, 300, 600); // camera position to x , y , z
  camera.lookAt( new THREE.Vector3() );

  // Define renderer
  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  // renderer.setPixelRatio( window.devicePixelRatio );
  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
  renderer.setSize( myCanvas.innerWidth(), myCanvas.innerHeight() );
  renderer.setClearColor( 0xf0f0f0 );
  myCanvas.append( renderer.domElement );

  var leftMargin = renderer.domElement.getBoundingClientRect().left;
  var topMargin = renderer.domElement.getBoundingClientRect().top;

  var ambientLight = new THREE.AmbientLight( 0x0c0c0c );
  scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  scene.add( directionalLight );





  // Initialize grid and plane
  var initGridPlane = function() {

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
  };





  // Lighting

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
      // myCanvas.style.cursor = 'move';
    }

    render();
  };

  function onDocumentMouseUp(event) {
    event.preventDefault();

    SELECTED.material.color.setHex(0xdeae66);
    
    console.log(SELECTED.position)
    // DO ME: ajax post/patch to update the coordinates of the box


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

  // PAULO: ADD CUBE!


  $('#new_box').submit(function(event){
    event.preventDefault();
    new_cube();
    // window.cube = cube;
    // var cube_id = cube.id;
    var locker_id = $('#my-canvas').data('locker').id;

    // $(this).find('#box_cube_id').val(cube_id);
    // var data = $(this).serialize();
    // console.log(data)

    // update table on the right
    // $.post('/lockers/'+locker_id+'/boxes/', data, function(){
    //   $.get('/lockers/'+locker_id);
    // });
  });

  var new_cube = function(){
    var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 ),
        cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xdeae66 } ),
        cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

    cube.position.x = Math.floor((Math.random() * 10) * 25); // PAULO: uses decimal points so it doesnt snap to grid
    cube.position.z = Math.floor((Math.random() * 10) * 25); 
    cube.position.y = 25;

    scene.add( cube );
    objects.push(cube);
    cubes.push(cube);
  }


  initGridPlane();
  animate();


});



