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
  var cubes = [];
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

  var leftMargin = renderer.domElement.getBoundingClientRect().left;
  var topMargin = renderer.domElement.getBoundingClientRect().top;

  // renderer.setPixelRatio( window.devicePixelRatio );
  renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
  renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );


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


  // Define 'add cube' function
  // var addCube = function() {
  //   var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
  //   var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xdeae66 } );
  //   var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  //   window.cube = cube;
  //   var cube_id = cube.id
  //   var locker_id = $('#my-canvas').data('locker').id;

  //   cube.position.x = Math.floor((Math.random() * 10) * 25);
  //   cube.position.z = Math.floor((Math.random() * 10) * 25);
  //   cube.position.y = 25;

  //   scene.add( cube );
  //   objects.push(cube);
  //   cubes.push(cube);

    // var boxParams = {
    //   box: {cube_id: cube_id}
    // };
    
    // $.ajax({
    //   url: '/lockers/'+locker_id+'/boxes/' + storganize.locker.boxes[storganize.locker.boxes.length-1].id,
    //   method: 'put',
    //   data: boxParams,      
    // });    
  // }


  $('#new_box').submit(function(event){
    event.preventDefault();

    var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
    var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xdeae66 } );
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    // window.cube = cube;
    var cube_id = cube.id;
    var locker_id = $('#my-canvas').data('locker').id;

    cube.position.x = Math.floor((Math.random() * 10) * 25);
    cube.position.z = Math.floor((Math.random() * 10) * 25);
    cube.position.y = 25;

    scene.add( cube );
    objects.push(cube);
    cubes.push(cube);    

    $(this).find('#box_cube_id').val(cube_id);
    var data = $(this).serialize();
    $.post('/lockers/'+locker_id+'/boxes/', data, function(){
      $.get('/lockers/'+locker_id);
    });

  });
  
  // addCube button
  // $('#add-cube-btn').click(function(){
  //   if($('#box_name').val() != "") {
  //   addCube();      
  //   }
  // });

  // var lockerBoxes = storganize.locker.boxes;
  // console.log(lockerBoxes);

  // $('#save-locker-btn').click(function(){
  //   for(var = i; i < lockerBoxes.length; i += 1){

  //     for(var = j; j < cubes.length; j += 1){
  //       if(lockerBoxes[i].cube_id === cubes[j].id){
  //         $.ajax({
  //           url: '/lockers/'+locker_id+'/boxes/' + lockerBoxes[i].id,
  //           method: 'put',
  //           data: boxParams,
  //         })          
  //       } 
  //     }
  //   }
  // });


  // Lighting
  var ambientLight = new THREE.AmbientLight( 0x0c0c0c );
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


  // Scene Exporting/Importing
  var controls = new function () {
    this.exportScene = function () {

      var lockerName = $('#my-canvas').data('locker').name
      var lockerLength = $('#my-canvas').data('locker').length
      var lockerWidth = $('#my-canvas').data('locker').width
      var lockerId = $('#my-canvas').data('locker').id;

      var exporter = new THREE.SceneExporter();
      var sceneJson = JSON.stringify(exporter.parse(scene));
      // localStorage.setItem('scene', sceneJson);

      var lockerParams = {
        locker: {scene_json: sceneJson}
      };

      $.ajax({
        url: '/lockers/'+lockerId,
        method: 'put',
        data: lockerParams,
      });
    }

    this.clearScene = function () {
        scene = new THREE.Scene();
    }

    this.importScene = function () {
        // var json = (localStorage.getItem('scene'));
        var json = storganize.locker.scene_json;
        
        var sceneLoader = new THREE.SceneLoader();

        sceneLoader.parse(JSON.parse(json), function (e) {

            var sceneItems = e.scene.children;
            objects = [];
            
            for (var i = 0; i < sceneItems.length; i += 1) {
              if(sceneItems[i] instanceof THREE.Mesh) {
                objects.push(sceneItems[i]);
              }
            }

            // objects = Object.keys(cubes).map(function(key) { 
            //   return cubes[key];
            // });
            window.objects = objects;
            scene = e.scene;
        }, '.');

        initGridPlane();
        animate();
    }
  };


  // Highlight cube when box is clicked in list on page
  $('.well').click(function(){
    for (var i = 0; i < objects.length; i += 1) {      
      if(objects[i].id === $(this).data('box').cube_id) {
        objects[i].material.color.setHex(0xff0000);
      }
    }
  });


  // GUI
  var gui = new dat.GUI({ autoPlace: false });
  gui.add(controls, "exportScene");
  gui.add(controls, "clearScene");
  gui.add(controls, "importScene");

  var guiContainer = document.getElementById('gui-container');
  guiContainer.appendChild(gui.domElement);

  
  initGridPlane();

  // call animation loop
  animate();
});



