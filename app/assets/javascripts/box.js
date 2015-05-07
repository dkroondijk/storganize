


// unused functions from test.js
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


