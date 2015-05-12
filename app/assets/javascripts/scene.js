$(document).ready(function(){

  // div that contains the renderer
  var myCanvas = $('#my-canvas')

  var scene = new THREE.Scene(),
      raycaster = new THREE.Raycaster(),
      mouse = new THREE.Vector2(),
      objects = [],
      cubes = [],
      SELECTED,
      box_id;

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


  // New box form submit
  $('#new_box').submit(function(event){
    event.preventDefault();

    var cube = newCube($("#box_name").val(), 25, 25, 25);
    addCube(cube);
    
    var data = {};
    data["box"] = {};
    data["box"]["x"] = cube.position.x;
    data["box"]["y"] = cube.position.y;
    data["box"]["z"] = cube.position.z;

    var formData = $(this).serialize() + '&' + $.param(data);
    var locker_id = $('#my-canvas').data('locker').id;

    var deparam = function (querystring) {
      querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
      var params = {}, pair, d = decodeURIComponent, i;
      for (i = querystring.length; i > 0;) {
        pair = querystring[--i].split('=');
        params[d(pair[0])] = d(pair[1]);
      }
      return params;
    };

    var boxData = deparam(formData);

    $.ajax({
      url: '/lockers/' + locker_id + '/boxes.html',
      method: 'post',
      data: formData,
      error: function(){
        alert("Could not add box!");
      },
      success: function(response){
        $('.box-list').append(response);
        $('input[type=text]').val('');
      }
    });


  });

  var newCube = function(name, x, y, z) {
    var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
    var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xdeae66 } );
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;
    cube.name = name;
    // cube.unique_id = "blah";

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

    for (var i = 0; i < cubes.length; i += 1) {   
      cubes[i].material.color.setHex(0xdeae66);
      cubes[i].material.transparent = false;
      cubes[i].material.opacity = 1;
    }

    if (intersects.length > 0 && intersect.object != plane) {
      
      intersect.object.material.color.setHex(0xff0000);

      SELECTED = intersect.object;      
      // myCanvas.style.cursor = 'move';
    }

    if(SELECTED) {
      $('li.box').each(function(index){
        // console.log($(this).data("box"));
        if($(this).data('box').name === SELECTED.name) {
          $(this).children('.box-items').slideToggle();
        }
      });

      var locker_id = storganize.locker.id;

      $.ajax({
        url: '/lockers/' + locker_id + '/boxes',
        method: 'get',
        dataType: 'json',
        error: function(){
          alert("Could not load locker boxes.")
        },
        success: function(data){
          for (var i = 0; i < data.length; i += 1) {
            if (data[i].name === SELECTED.name) {
              box_id = data[i].id;
            }
          }        
        }
      });
    }

    render();

    return false;
  };

  function onDocumentMouseUp(event) {
    event.preventDefault();

    if(!SELECTED) { return }

    SELECTED.material.color.setHex(0xdeae66);
    // console.log(SELECTED);

    var data = {};
    data["box"] = {};
    data["box"]["x"] = SELECTED.position.x;
    data["box"]["y"] = SELECTED.position.y;
    data["box"]["z"] = SELECTED.position.z;

    var lockerBoxes = storganize.locker.boxes;
    var locker_id = storganize.locker.id;

    $.ajax({
      url: '/lockers/' + locker_id + '/boxes/' + box_id,
      method: 'patch',
      dataType: 'json',
      data: data,
      error: function(){
        alert("Could not update box");
        SELECTED = null;
      },
      success: function(){            
        SELECTED = null;
      }
    });
  };


  var deleteBox = function(id, box, callback){
    
    var locker_id = storganize.locker.id;

    $.ajax({
      url: '/lockers/' + locker_id + '/boxes/' + id,
      method: 'delete',
      dataType: 'json',
      error: function(){
        alert("Can't delete box");
      },
      success: callback(box)
    });
  };

  $(document).on('click', '.box-delete-btn', function(){
    var boxId = $(this).parents('.box').data('box').id;
    var boxName = $(this).parents('.box').data('box').name;

    deleteBox(boxId, this, function(box){
      $(box).parents('.box').slideUp();
    });

    for (var i = 0; i < cubes.length; i += 1) {
      if(cubes[i].name === boxName) {
        scene.remove(cubes[i]);
      }
    render();
    }
  });


  var deleteItem = function(boxId, itemId, item, callback){
    
    var locker_id = storganize.locker.id;

    $.ajax({
      url: '/lockers/' + locker_id + '/boxes/' + boxId + '/items/' + itemId,
      method: 'delete',
      dataType: 'json',
      error: function(){
        alert("Can't delete item");
      },
      success: callback(item)
    });
  };

  $(document).on('click', '.item-delete-btn', function(){
    var boxId = $(this).parents('.box').data('box').id;
    var itemId = $(this).parents('.item').data('item').id;

    deleteItem(boxId, itemId, this, function(item){
      $(item).parents('.item').slideUp();
    });

  });


  // Highlight cube when box is clicked in list on page
  $(document).on('click', 'li.box .box-name-link', function(){
    for (var i = 0; i < cubes.length; i += 1) {   
      cubes[i].material.color.setHex(0xdeae66);
      cubes[i].material.transparent = false;
      cubes[i].material.opacity = 1;

      if(cubes[i].name === $(this).parents('.box').data('box').name) {
        cubes[i].material.color.setHex(0xff0000);
      } else {
        cubes[i].material.transparent = true;
        cubes[i].material.opacity = 0.3;        
      }
    }
  });

  $(document).on("click", '#add-item-btn', function(){
    $(this).parents('.box').children('.badge').children('a').html(parseInt($(this).parents('.box').data('items').length+1));
  });


  $(document).on('click', '.item-delete-btn', function(){
    $(this).parents('.box').children('.badge').children('a').html(parseInt($(this).parents('.box').data('items').length-1));
  });
    


  $('.box-items').hide();
  
  initialize();

  // call animation loop
  animate();
});



