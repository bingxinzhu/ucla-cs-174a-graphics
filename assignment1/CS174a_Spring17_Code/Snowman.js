Declare_Any_Class( "Snowman",  
  { 'construct'( context )
      { var shapes = { 'sphere' : new Grid_Sphere(20,20),
						'cone' : new Closed_Cone(10,10),
						'triangle'        : new Triangle(),
						'cylinder' : new Capped_Cylinder(4,12)};
        this.submit_shapes( context, shapes );
        this.define_data_members( { bluePlastic  : context.shaders_in_use["Phong_Model" ].material( Color( .1,.1,.9, 1 ), .4, .8, .4, 20 ), 
									orangePlastic  : context.shaders_in_use["Phong_Model" ].material( Color( 1,.5,.3, 1 ), .4, .8, .4, 20 ),
									brownPlastic  : context.shaders_in_use["Phong_Model" ].material( Color( .82,.7,.55, 1 ), .4, .8, .4, 20 ),
                                    blueGlass    : context.shaders_in_use["Phong_Model" ].material( Color( .5,.5, 1,.2 ), .4, .8, .4, 40 ),
									stars: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] )} ); 
      },

    'display'( graphics_state )
      { var model_transform = identity();             // We have to reset model_transform every frame
        
        graphics_state.lights = [ new Light( vec4(  30,  30,  34, 1 ), Color( 0, .4, 0, 1 ), 100000 ),
                                  new Light( vec4( -10, -20, -14, 0 ), Color( 1, 1, .3, 1 ), 100    ) ];
        /**********************************
        Start coding down here!!!!
        **********************************/                                     // From here on down it's just some example shapes drawn 
		//model_transform = mult(model_transform, scale(2,2,2));
		//this.shapes.sphere.draw(graphics_state, model_transform, this.bluePlastic);
		//model_transform = mult(model_transform, scale(1/2,1/2,1/2));
		//model_transform = mult(model_transform, translation(0,3,0));
		model_transform = mult(model_transform, rotation(graphics_state.animation_time/20, 0, 1, 0));
        this.shapes.sphere.draw(graphics_state, model_transform, this.bluePlastic);
        
        model_transform = mult(model_transform, translation(0, 0, 2));
            model_transform = mult(model_transform, scale(.3, .3, 1));
                this.shapes.cone.draw(graphics_state, model_transform, this.orangePlastic);
            model_transform = mult(model_transform, scale(1/.3, 1/.3, 1));
        model_transform = mult(model_transform, translation(0, 0, -2));
        
        model_transform = mult(model_transform, translation(0, -3, 0));
        model_transform = mult(model_transform, scale(2, 2, 2));
        this.shapes.sphere.draw(graphics_state, model_transform, this.bluePlastic);
        
        model_transform = mult(model_transform, rotation(90, 0, 1, 0));
            model_transform = mult(model_transform, translation(0, 0, 2));
                model_transform = mult(model_transform, scale(.1, .1, 2));
                    this.shapes.cylinder.draw(graphics_state, model_transform, this.brownPlastic);
                model_transform = mult(model_transform, scale(1/.1, 1/.1, 1/2));
            model_transform = mult(model_transform, translation(0, 0, -2));
        model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
        
        model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
            model_transform = mult(model_transform, translation(0, 0, 2));
                model_transform = mult(model_transform, scale(.1, .1, 2));
                    this.shapes.cylinder.draw(graphics_state, model_transform, this.brownPlastic);
                model_transform = mult(model_transform, scale(1/.1, 1/.1, 1/2));
            model_transform = mult(model_transform, translation(0, 0, -2));
        model_transform = mult(model_transform, rotation(90, 0, 1, 0));
        
        model_transform = mult(model_transform, translation(0, -3, 0));
        model_transform = mult(model_transform, scale(2, 2, 2));
        this.shapes.sphere.draw(graphics_state, model_transform, this.bluePlastic);
		
      }
  }, Scene_Component );

Declare_Any_Class( "Surfaces_Tester",
  { 'construct'( context )
      { context.globals.animate = true;
        var shapes = { 'good_sphere' : new Subdivision_Sphere( 4 ),
                       'box'         : new Cube(),
                       'strip'       : new Square(),
                       'septagon'    : new Regular_2D_Polygon(  2,  7 ),
                       'tube'        : new Cylindrical_Tube  ( 10, 10 ),
                       'open_cone'   : new Cone_Tip          (  3, 10 ),
                       'donut'       : new Torus             ( 15, 15 ),
                       'bad_sphere'  : new Grid_Sphere       ( 10, 10 ),
                       'cone'        : new Closed_Cone       ( 10, 10 ),
                       'capped'      : new Capped_Cylinder   (  4, 12 ),
                       'axis'        : new Axis_Arrows(),
                       'prism'       :     Capped_Cylinder   .prototype.auto_flat_shaded_version( 10, 10 ),
                       'gem'         :     Subdivision_Sphere.prototype.auto_flat_shaded_version(  2     ),
                       'gem2'        :     Torus             .prototype.auto_flat_shaded_version( 20, 20 ),
                       'swept_curve' : new Surface_Of_Revolution( 10, 10, 
                                            [ vec3( 2, 0, -1 ), vec3( 1, 0, 0 ), vec3( 1, 0, 1 ), vec3( 0, 0, 2 ) ], 120, [ [ 0, 7 ] [ 0, 7 ] ] ) 
                     };
        this.submit_shapes( context, shapes );
        this.define_data_members( { shader: context.shaders_in_use["Phong_Model"], textures: Object.values( context.textures_in_use ) } );
      },
    'draw_all_shapes'( model_transform, graphics_state )
      { var i = 0, t = graphics_state.animation_time / 1000;
        
        for( key in this.shapes )
        { i++;
          var funny_function_of_time = 50*t + i*i*Math.cos( t/2 ),
              random_material        = this.shader.material( Color( (i % 7)/7, (i % 6)/6, (i % 5)/5, 1 ), .2, 1, 1, 40, this.textures[ i % this.textures.length ] )
              
          model_transform = mult( model_transform, rotation( funny_function_of_time, i%3 == 0, i%3 == 1, i%3 == 2 ) );   // Irregular motion
          model_transform = mult( model_transform, translation( 0, -3, 0 ) );
          this.shapes[ key ].draw( graphics_state, model_transform, random_material );        //  Draw the current shape in the list    
        }
        return model_transform;     
      },
    'display'( graphics_state )
      { var model_transform = identity(); 
        for( var i = 0; i < 7; i++ )                                    // Another example of not every shape owning the same pair of lights:
        { graphics_state.lights = [ new Light( vec4( i % 7 - 3, i % 6 - 3, i % 5 - 3, 1 ), Color( 1, 0, 0, 1 ), 100000000 ),
                                    new Light( vec4( i % 6 - 3, i % 5 - 3, i % 7 - 3, 1 ), Color( 0, 1, 0, 1 ), 100000000 ) ];
        
          model_transform = this.draw_all_shapes( model_transform, graphics_state );      // *** How to call a function and still have a single matrix state ***
          model_transform = mult( model_transform, rotation( 360 / 13, 0, 0, 1 ) );
        }
      }
  }, Scene_Component );


Declare_Any_Class( "Bump_Map_And_Mesh_Loader",     // An example where one teapot has a bump-mapping-like hack, and the other does not.
  { 'construct'( context )
      { context.globals.animate = true;
        context.globals.graphics_state.camera_transform = translation( 0, 0, -5 );
      
        var shapes = { "teapot": new Shape_From_File( "teapot.obj" ) };
        this.submit_shapes( context, shapes );
        this.define_data_members( { stars: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] ),
                                    bumps: context.shaders_in_use["Fake_Bump_Map"].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] )});
      },
    'display'( graphics_state )
      { var t = graphics_state.animation_time;
        graphics_state.lights = [ new Light( mult_vec( rotation( t/5, 1, 0, 0 ), vec4(  3,  2,  10, 1 ) ), Color( 1, .7, .7, 1 ), 100000 ) ];
        
        for( let i of [ -1, 1 ] )
        { var model_transform = mult( rotation( t/40, 0, 2, 1 ), translation( 2*i, 0, 0 ) );
              model_transform = mult( model_transform, rotation( t/25, -1, 2, 0 ) );
          this.shapes.teapot.draw( graphics_state, mult( model_transform, rotation( -90, 1, 0, 0 ) ), i == 1 ? this.stars : this.bumps );
        }
      }
  }, Scene_Component );
  
  
  Declare_Any_Class( "Example_Animation",  // An example of a Scene_Component that our class Canvas_Manager can manage.  This one draws the scene's 3D shapes.
  { 'construct'( context )
      { var shapes = { 'triangle'        : new Triangle(),                               // At the beginning of our program, instantiate all shapes we plan to use,
                       'strip'           : new Square(),                                // each with only one instance in the graphics card's memory.
                       'bad_tetrahedron' : new Tetrahedron( false ),                   // For example we would only create one "cube" blueprint in the GPU, but then 
                       'tetrahedron'     : new Tetrahedron( true ),                   // re-use it many times per call to display to get multiple cubes in the scene.
                       'windmill'        : new Windmill( 10 ) };
        this.submit_shapes( context, shapes );
        // *** Materials: *** Declare new ones as temps when needed; they're just cheap wrappers for some numbers.  1st parameter:  Color (4 floats in RGBA format),
        // 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Optional texture object, leave off for un-textured.
        this.define_data_members( { purplePlastic: context.shaders_in_use["Phong_Model" ].material( Color( .9,.5,.9, 1 ), .4, .4, .8, 40 ),
                                    greyPlastic  : context.shaders_in_use["Phong_Model" ].material( Color( .5,.5,.5, 1 ), .4, .8, .4, 20 ),   // Smaller exponent means 
                                    blueGlass    : context.shaders_in_use["Phong_Model" ].material( Color( .5,.5, 1,.2 ), .4, .8, .4, 40 ),     // a bigger shiny spot.
                                    fire         : context.shaders_in_use["Funny_Shader"].material() } ); 
      },
    'display'( graphics_state )
      { var model_transform = identity();             // We have to reset model_transform every frame.
        
        // *** Lights: *** Values of vector or point lights over time.  Two different lights *per shape* supported; more requires changing a number in the vertex shader.
        
        graphics_state.lights = [ new Light( vec4(  30,  30,  34, 1 ), Color( 0, .4, 0, 1 ), 100000 ),      // Arguments to construct a Light(): Light source position or 
                                  new Light( vec4( -10, -20, -14, 0 ), Color( 1, 1, .3, 1 ), 100    ) ];    // vector (homogeneous coordinates), color, and size.  
        /**********************************
        Start coding down here!!!!
        **********************************/                                     // From here on down it's just some example shapes drawn 
       
        
                                                                             // for you -- freely replace them with your own!
        model_transform = mult( model_transform, translation( 0, 5, 0 ) );
        this.shapes.triangle       .draw( graphics_state, model_transform,                      this.purplePlastic );
        
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.strip          .draw( graphics_state, model_transform,                      this.greyPlastic   );
        
        var t = graphics_state.animation_time/1000,   tilt_spin   = rotation( 700*t, [          .1,          .8,             .1 ] ),
                                                      funny_orbit = rotation(  90*t, [ Math.cos(t), Math.sin(t), .7*Math.cos(t) ] );

        // Many shapes can share influence from the same pair of lights, but they don't have to.  All the following shapes will use these lights instead of the above ones.
        
        graphics_state.lights = [ new Light( mult_vec( tilt_spin, vec4(  30,  30,  34, 1 ) ), Color( 0, .4, 0, 1 ), 100000               ),
                                  new Light( mult_vec( tilt_spin, vec4( -10, -20, -14, 0 ) ), Color( 1, 1, .3, 1 ), 100*Math.cos( t/10 ) ) ];
                                  
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.tetrahedron    .draw( graphics_state, mult( model_transform, funny_orbit ), this.purplePlastic );
        
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.bad_tetrahedron.draw( graphics_state, mult( model_transform, funny_orbit ), this.greyPlastic   );
        
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, mult( model_transform, tilt_spin ),   this.purplePlastic );
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, model_transform,                      this.fire          );
        model_transform = mult( model_transform, translation( 0, -2, 0 ) );
        this.shapes.windmill       .draw( graphics_state, model_transform,                      this.blueGlass     );
      }
  }, Scene_Component );  // End of class definition


 'draw_bee'( model_transform, graphics_state )
      { 
        var t = graphics_state.animation_time/100;

        model_transform = mult( model_transform, translation( -5, 3, 0 ) );
        model_transform = mult(model_transform, scale(0.5, 0.5, 0.5));
        this.shapes.ball       .draw( graphics_state, model_transform,                      this.yellow_clay );
        model_transform = mult( model_transform, translation( -3, 0, 0 ) );
        model_transform = mult(model_transform, scale(2, 1, 1));
        this.shapes.box       .draw( graphics_state, model_transform,                      this.greyPlastic );
        model_transform = mult( model_transform, translation( -1.9, 0, 0 ) );
        model_transform = mult(model_transform, scale(1.1, 1.4, 1.3));
        this.shapes.ball       .draw( graphics_state, model_transform,                      this.stars );

        model_transform = mult( model_transform, translation( 2, 0.8, 1.5 ) );
        model_transform = mult(model_transform, scale(0.3, 0.1, 1.2));



      // var t = graphics_state.animation_time/100,  
       //orbit = mult(rotation( 3 * t, [          .1,          .8,             .1 ] ),translation(0, Math.sin(t), 0));
//model_transform = this.draw_bee( mult( model_transform, orbit ), graphics_state ); 

       // var model_transform_tmp = mult(model_transform, translation( 0, 4 * Math.sin(t), 0 ) );
       var rot_angle = 8;
       var model_transform_tmp = mult(model_transform, rotation(t * rot_angle, 0,1,0));
        this.shapes.box       .draw( graphics_state, model_transform_tmp,                      this.greyPlastic );

        model_transform = mult( model_transform, translation( 0, 0, -2.7 ) );
        model_transform_tmp = mult(model_transform,translation( 0, 4 * Math.sin(t), 0 )  );
        this.shapes.box       .draw( graphics_state, model_transform_tmp,                      this.greyPlastic );


        return model_transform;     
      },
      'display'( graphics_state )
      { 
        var model_transform = identity(); 
        // *** Lights: *** Values of vector or point lights over time.  Two different lights *per shape* supported; more requires changing a number in the vertex shader.
        graphics_state.lights = [ new Light( vec4(  30,  30,  34, 1 ), Color( 0, .4, 0, 1 ), 100000 ),      // Arguments to construct a Light(): Light source position or 
                                  new Light( vec4( -10, -20, -14, 0 ), Color( 1, 1, .3, 1 ), 100    ) ];    // vector (homogeneous coordinates), color, and size.  
        
       this.draw_bee(model_transform, graphics_state); 


       // model_transform = mult(model_transform, rotation(this.graphicsState.animation_time / 20, 0, 1, 0));
      // var t = graphics_state.animation_time/100,  
       //orbit = mult(rotation( 3 * t, [          .1,          .8,             .1 ] ),translation(0, Math.sin(t), 0));
       // model_transform = this.draw_bee( mult( model_transform, orbit ), graphics_state );
       //model_transform = this.draw_bee(model_transform, graphics_state);   
    //    this.draw_tree(graphics_state);
      }

Animation.prototype.bee = function (model_transform) {
    var BEE_SCALE = 0.5;
    var MAX_HEIGHT_CHANGE = 1;
    var VERTICAL_PERIOD = 4000; // milliseconds
    var RADIUS = 7;
    var BEE_BODY_TEXTURE = new Material(getColorVec(10, 10, 10, 255), 1, 1, 1, 255);
    var BEE_ABDOMEN_TEXTURE = new Material(getColorVec(230, 200, 0, 255), 1, 1, 1, 255);

    var origin = model_transform;
    // Orbit bee clockwise at radius
    model_transform = mult(model_transform, rotate(this.graphicsState.animation_time / -20, 0, 1, 0));
    var bee = mult(model_transform, translate(RADIUS, 0, 0));

    // Move bee up and down
    var y = Math.sin(this.graphicsState.animation_time / VERTICAL_PERIOD * 4);
    bee = mult(bee, translate(0, y * MAX_HEIGHT_CHANGE, 0));

    // Scale bee
    bee = mult(bee, scale(BEE_SCALE, BEE_SCALE, BEE_SCALE));

    // Draw bee
    var beeThorax = mult(bee, scale(1.5, 1.5, 3));
    this.m_cube.draw(this.graphicsState, beeThorax, BEE_BODY_TEXTURE);

    var beeHead = mult(bee, translate(0, 0, 2.5));
    beeHead = mult(beeHead, scale(1, 1, 1));
    this.m_sphere.draw(this.graphicsState, beeHead, BEE_BODY_TEXTURE);

    var beeAbdomen = mult(bee, translate(0, 0, -2.25));
    beeAbdomen = mult(beeAbdomen, scale(1, 1, 1.5));
    this.m_sphere.draw(this.graphicsState, beeAbdomen, BEE_ABDOMEN_TEXTURE);

    var beeLegLeftForward = mult(bee, translate(0.75, -0.5, 0.75));
    this.beeLeg(beeLegLeftForward);
    var beeLegLeftCenter = mult(bee, translate(0.75, -0.5, 0));
    this.beeLeg(beeLegLeftCenter);
    var beeLegLeftRear = mult(bee, translate(0.75, -0.5, -0.75));
    this.beeLeg(beeLegLeftRear);
    var beeWingLeft = mult(bee, translate(0.75, 0.75, 0));
    this.beeWing(beeWingLeft);

    // Flip orientation to generate the right side
    var beeRight = mult(bee, rotate(180, 0, 1, 0));
    var beeLegRightForward = mult(beeRight, translate(0.75, -0.5, 0.75));
    this.beeLeg(beeLegRightForward);
    var beeLegRightCenter = mult(beeRight, translate(0.75, -0.5, 0));
    this.beeLeg(beeLegRightCenter);
    var beeLegRightRear = mult(beeRight, translate(0.75, -0.5, -0.75));
    this.beeLeg(beeLegRightRear);
    var beeWingRight = mult(beeRight, translate(0.75, 0.75, 0));
    this.beeWing(beeWingRight);

    return origin;
};


Animation.prototype.beeLeg = function (model_transform) {
    var LEG_LENGTH = 1.5;
    var LEG_WIDTH = 0.2;
    var INITIAL_ANGLE = -60;
    var SWAY_PERIOD = 2000; // milliseconds
    var MAX_SWAY = 30; // degrees
    var BEE_BODY = new Material(getColorVec(10, 10, 10, 255), 1, 1, 1, 255);

    // Draw "thigh"
    model_transform = mult(model_transform, rotate(INITIAL_ANGLE, 0, 0, 1));
    model_transform = this.periodicPivot(model_transform, SWAY_PERIOD, MAX_SWAY);
    var origin = model_transform;
    model_transform = mult(model_transform, translate(LEG_LENGTH / 2, 0, 0));
    model_transform = mult(model_transform, scale(LEG_LENGTH, LEG_WIDTH, LEG_WIDTH));
    this.m_cube.draw(this.graphicsState, model_transform, BEE_BODY);

    // Draw "femur"
    var legEnd = mult(origin, translate(LEG_LENGTH, 0, 0));
    model_transform = mult(legEnd, rotate(INITIAL_ANGLE * 1.1, 0, 0, 1));
    model_transform = this.periodicPivot(model_transform, SWAY_PERIOD, MAX_SWAY);
    var origin = model_transform;
    model_transform = mult(model_transform, translate(LEG_LENGTH / 2, 0, 0));
    model_transform = mult(model_transform, scale(LEG_LENGTH, LEG_WIDTH, LEG_WIDTH));
    this.m_cube.draw(this.graphicsState, model_transform, BEE_BODY);

    return origin;
};


Animation.prototype.bee_legs = function (model_transform, index, separator)
{
    var leg_h = 2,
        leg_l = 0.5,
        leg_swing_angle = (Math.sin(this.graphicsState.animation_time/800)+1 )* 0.5,
        leg_w = 0.5,
        rotation_axis = 1,
        bod_w = body_width,
        u_rotation_angle = 30,
        l_rotation_angle = 50;

    //For right side legs we push the legs backwards in the z direction and rotate it around an inverted axis
    if(index % 2 != 0)
    {
        bod_w *= -1;
        rotation_axis = -1;
        leg_w *= -1;
    }
    
    //Draw upper part of leg - separator determines the distance between each consecutive leg
    model_transform = mult(model_transform, translation(-leg_l + separator, -body_height/2, bod_w/2));
    model_transform = mult(model_transform, rotation(u_rotation_angle * leg_swing_angle, rotation_axis, 0, 0));
    model_transform = mult(model_transform, translation(0, -leg_h/2, leg_w/2));
    model_transform = mult(model_transform, scale(leg_l, leg_h, leg_w));
    this.m_cube.draw(this.graphicsState, model_transform, body_color);
    model_transform = mult(model_transform, scale(1/leg_l, 1/leg_h, 1/leg_w));

    //Draw lower leg
    model_transform = mult(model_transform, translation(0, -leg_h/2, -leg_w/2));
    model_transform = mult(model_transform, rotation(l_rotation_angle *leg_swing_angle, rotation_axis, 0, 0));
    model_transform = mult(model_transform, translation(0, -leg_h/2, leg_w/2));
    model_transform = mult(model_transform, scale(leg_l, leg_h, leg_w));
    this.m_cube.draw(this.graphicsState, model_transform, body_color);
}

Declare_Any_Class( "Bump_Map_And_Mesh_Loader",     // An example where one teapot has a bump-mapping-like hack, and the other does not.
  { 'construct'( context )
      { context.globals.animate = true;
        context.globals.graphics_state.camera_transform = translation( 0, 0, -5 );
      
        var shapes = { "teapot": new Shape_From_File( "teapot.obj" ) };
        this.submit_shapes( context, shapes );
        this.define_data_members( { stars: context.shaders_in_use["Phong_Model"  ].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] ),
                                    bumps: context.shaders_in_use["Fake_Bump_Map"].material( Color( .5,.5,.5,1 ), .5, .5, .5, 40, context.textures_in_use["stars.png"] )});
      },
    'display'( graphics_state )
      { var t = graphics_state.animation_time;
        graphics_state.lights = [ new Light( mult_vec( rotation( t/5, 1, 0, 0 ), vec4(  3,  2,  10, 1 ) ), Color( 1, .7, .7, 1 ), 100000 ) ];
        
        for( let i of [ -1, 1 ] )
        { var model_transform = mult( rotation( t/40, 0, 2, 1 ), translation( 2*i, 0, 0 ) );
              model_transform = mult( model_transform, rotation( t/25, -1, 2, 0 ) );
          this.shapes.teapot.draw( graphics_state, mult( model_transform, rotation( -90, 1, 0, 0 ) ), i == 1 ? this.stars : this.bumps );
        }
      }
  }, Scene_Component );

      'draw_bee'( model_transform, graphics_state)
      {
        var t = graphics_state.animation_time/100, 
        body_height = 2,
        head_radius = 1, 
        tail_width = 3,
        tail_height = tail_width/2,
        wing_height = body_height,
        body_width = 4,
        body_length = 2;
        bee = mult(model_transform, translation(-3,0,0)),
        orbit = mult(rotation(3 * t, 0, 1, 0),translation(0, Math.sin(t), 0));
        bee = mult(bee, orbit);
        var head = this.draw_bee_head(bee, graphics_state, head_radius);
        var body = this.draw_bee_body(head, graphics_state, body_height, body_length,body_width,head_radius);
        var tail = this.draw_bee_tail(body, graphics_state, tail_width, body_length,tail_height);
        //bee = this.draw_leg(bee, graphics_state);
        var left_wing = this.draw_bee_left_wing(bee, graphics_state, body_width, body_height, body_length);
        //this.draw_bee_right_wing(bee, graphics_state, body_width, body_height, body_length);
        bee = mult(bee, translation(0,-2,0));
        bee = this.draw_leg(bee, graphics_state);

        return model_transform;
      },

       'draw_leg'(model_transform, graphics_state)
      {
        var leg_length = 0.1,
            leg_width = 0.05,
            leg_height = 0.5,
            angle1 = 25,
            body_height = 1,
            body_width = 2,
            angle2 = 60,

            body_length = 1;
            upper_leg = model_transform;

            // draw upper leg
            model_transform = mult(model_transform,translation(2.6,1.7,-0.3));
            model_transform = mult(model_transform, translation(-leg_width , -body_height/2, body_width/2));
          
            model_transform = mult(model_transform, rotation(-angle1, 1, 0, 0));
            model_transform = mult(model_transform, translation(0, -leg_height/2, leg_width/2));
            model_transform = mult(model_transform, scale(leg_length, leg_height, leg_width));
            this.shapes.box.draw(graphics_state, model_transform, this.greyPlastic);
            
            model_transform = mult(model_transform, scale(1/leg_length, 1/leg_height, 1/leg_width));

          // draw lower leg
            model_transform = mult(model_transform, translation(0, -leg_height/2, -leg_width/2 + 0.5));
            model_transform = mult(model_transform, rotation(angle2, 1, 0, 0));
            model_transform = mult(model_transform, translation(0, -leg_height/2-0.7, -leg_width/2));
            model_transform = mult(model_transform, scale(leg_length, leg_height, leg_width));
            this.shapes.box.draw(graphics_state, model_transform, this.greyPlastic);

      },

      'draw_bee_left_wing'(model_transform, graphics_state, body_width, body_height, body_length)
      {
        var wing_height = 0.05,
            wing_width = 0.6,
            wing_length = 2,
            origin = model_transform,
            t = graphics_state.animation_time/300;
        var rotation_axis = mult( origin, translation( 0,  body_height / 2, body_length/2 ) );
        model_transform = mult(rotation_axis, rotation(30 * Math.sin(t), [1,0,0]));
        model_transform = mult( model_transform, translation( 0, wing_height, wing_length/2 ) );
        model_transform = mult(model_transform, scale(wing_width/2, wing_height/2, wing_length/2));
        this.shapes.box.draw( graphics_state, model_transform,this.greyPlastic );
        return model_transform;
      },

      'draw_bee_right_wing'(model_transform, graphics_state, body_width, body_height, body_length)
      {
        var wing_height = 0.05,
            wing_width = 0.6,
            wing_length = 2,
            origin = model_transform,
            t = graphics_state.animation_time/300;
        var rotation_axis = mult( origin, translation( 0,  body_height / 2, - body_length/2 ) );
        model_transform = mult(rotation_axis, rotation(- 30 * Math.sin(t), [1,0,0]));
        model_transform = mult( model_transform, translation( 0, wing_height, - wing_length/2 ) );
        model_transform = mult(model_transform, scale(wing_width/2, wing_height/2, - wing_length/2));
        this.shapes.box.draw( graphics_state, model_transform,this.greyPlastic );
        return model_transform;
      },



            var upper_leg = mult(model_transform, rotation(30 * Math.sin(t), [1,0,0]));

             upper_leg_rotation_axis = mult(upper_leg, translation(0, body_length,0));
            upper_leg = mult(upper_leg, translation(0, -leg_length, -leg_height));
            upper_leg = mult(upper_leg, scale(leg_width, leg_length, leg_height));
            this.shapes.box.draw(graphics_state, upper_leg, this.greyPlastic);
            upper_leg = mult(upper_leg, scale(1/leg_width, 1/leg_length, 1/leg_height));

            upper_leg = mult(upper_leg, translation(0, leg_length, leg_height));

                        // draw lower leg
            //var joint = upper_leg;
            var lower_leg = model_transform;
            var lower_leg_rotation_axis = mult(upper_leg, translation(0,-6*  leg_length,0));

           //lower_leg = mult(lower_leg_rotation_axis, rotation(10* Math.sin(t), [1,0,0]));
            //upper_leg = mult(upper_leg, translation(0, -leg_length, -leg_height));
          //  angle1 = 60;

           // lower_leg = mult(lower_leg_rotation_axis, rotation(t/10, [1,0,0]));
            //lower_leg = mult(lower_leg, translation(0, - leg_length, -  leg_height));
            //lower_leg = mult(lower_leg, scale(leg_width, leg_length, leg_height));


            'draw_leg'(model_transform, graphics_state)
      {
        var leg_length = 1,
            leg_width = 0.11,
            leg_height = 0.05,
            body_height = 1,
            body_width = 2,
            body_length = 1;
            upper_leg = model_transform,
            t = graphics_state.animation_time/300;
            // draw upper leg
            var upper_leg = mult(model_transform, rotation(35 * Math.abs(Math.sin(t)), [1,0,0]));
            upper_leg = mult(upper_leg, translation(0, -leg_length, -leg_height));
            upper_leg = mult(upper_leg, scale(leg_width, leg_length, leg_height));
            this.shapes.box.draw(graphics_state, upper_leg, this.greyPlastic);
            upper_leg = mult(upper_leg, scale(1/leg_width, 1/leg_length, 1/leg_height));
            upper_leg = mult(upper_leg, translation(0, leg_length, leg_height));
            return upper_leg;
      },
'draw_bee'( model_transform, graphics_state)
      {
        var t = graphics_state.animation_time/100, 
        body_height = 2,
        head_radius = 1, 
        tail_width = 3,
        tail_height = tail_width/2,
        wing_height = body_height,
        body_width = 4,
        body_length = 2;
        bee = mult(model_transform, translation(-3,0,0));
       // orbit = mult(rotation(3 * t, 0, 1, 0),translation(0, Math.sin(t), 0));
        //bee = mult(bee, orbit);
        var head = this.draw_bee_head(bee, graphics_state, head_radius);
        var body = this.draw_bee_body(head, graphics_state, body_height, body_length,body_width,head_radius);
        var tail = this.draw_bee_tail(body, graphics_state, tail_width, body_length,tail_height);
        var left_wing = this.draw_bee_left_wing(body, graphics_state, body_width, body_height, body_length);
        var right_wing = this.draw_bee_right_wing(body, graphics_state, body_width, body_height, body_length);
        var increment = body_width/4;
        var begin = mult(body, translation(body_width/4, - body_length/2 , body_height/2));
       
        bee = this.draw_leg(begin, graphics_state);
        bee = mult(bee, translation(0,-2,0));
        bee = this.draw_leg(bee, graphics_state);

        return model_transform;
      },




      '