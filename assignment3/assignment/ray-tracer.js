// CS 174a Project 3 Ray Tracer Skeleton
 
var mult_3_coeffs = function( a, b ) { return [ a[0]*b[0], a[1]*b[1], a[2]*b[2] ]; };       // Convenient way to combine two color-reducing vectors
 
Declare_Any_Class( "Ball",              // The following data members of a ball are filled in for you in Ray_Tracer::parse_line():
  { 'construct'( position, size, color, k_a, k_d, k_s, n, k_r, k_refract, refract_index )
      { this.define_data_members( { position, size, color, k_a, k_d, k_s, n, k_r, k_refract, refract_index } );
  // TODO:  Finish filling in data members, using data already present in the others. 
        this.model_transform = identity();
        this.model_transform = mult(this.model_transform, translation(position[0], position[1], position[2]));
        this.model_transform = mult(this.model_transform, scale(size[0], size[1], size[2]));
        this.model_transform_inverse = (inverse(this.model_transform));
      },    'intersect'( ray, existing_intersection, minimum_dist )
      { 
        /*
          calculate intersection using the form in discussion slides
          |c|^2 * t^2 + 2 * (S dot c)t + |S|^2 - 1 = 0 corresponding to
            A   * t^2 + 2 * Bt         + C = 0
          so A = |c|^2, B = S dot c, C = |S|^2 - 1
        */
        var S = mult_vec(this.model_transform_inverse, ray.origin);
        var c = mult_vec(this.model_transform_inverse, ray.dir); 
        // get three dimension of S and c
        var threeD_S = S.slice(0, 3);              
        var threeD_c = c.slice(0, 3);  

        var A = dot(threeD_c, threeD_c);
        var B = dot(threeD_S, threeD_c);
        var C = dot(threeD_S, threeD_S) - 1.0;
        var discriminant = B * B - A * C;    
        if(discriminant >= 0.0) {
          // by discussion slides 8
          var hit_1 = (-B + Math.sqrt(discriminant)) / A;      
          var hit_2 = (-B - Math.sqrt(discriminant)) / A;
          if(hit_1 < minimum_dist || hit_1 > hit_2) hit_1 = hit_2; 
          if(hit_1 < minimum_dist || hit_1 >= existing_intersection.distance) return existing_intersection;
     
          /* by the hint of assignment description: convert just 
             a single operator like * or - into a scale_vec, mult_vec, mult_3_coeffs, add, or subtract 
          */
          var tempC = scale_vec(hit_1, c);            
          var ray_tmp = add(S, tempC), tmp_Model_transform_inverse = transpose(this.model_transform_inverse);
          var my_tmp_normal = normalize(mult_vec(tmp_Model_transform_inverse, ray_tmp).slice(0, 3));
          
          return { distance: hit_1, ball: this, normal:  my_tmp_normal.concat(0)};
        }

        return existing_intersection;
      }
  } );
 
Declare_Any_Class( "Ray_Tracer",
  { 'construct'( context )
      { this.define_data_members( { width: 32, height: 32, near: 1, left: -1, right: 1, bottom: -1, top: 1, ambient: [.1, .1, .1], recur : 0,
                                    balls: [], lights: [], curr_background_function: "color", background_color: [0, 0, 0, 1 ],
                                    scanline: 0, visible: true, scratchpad: document.createElement('canvas'), gl: context.gl,
                                    shader: context.shaders_in_use["Phong_Model"] } );
        var shapes = { "square": new Square(),                  // For texturing with and showing the ray traced result
                       "sphere": new Subdivision_Sphere( 4 ) };   // For drawing with ray tracing turned off
        this.submit_shapes( context, shapes );
 
        this.texture = new Texture ( context.gl, "", false, false );           // Initial image source: Blank gif file
        this.texture.image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        context.textures_in_use[ "procedural" ]  =  this.texture;
 
        this.scratchpad.width = this.width;  this.scratchpad.height = this.height;
        this.imageData          = new ImageData( this.width, this.height );     // Will hold ray traced pixels waiting to be stored in the texture
        this.scratchpad_context = this.scratchpad.getContext('2d');             // A hidden canvas for assembling the texture
 
        this.background_functions =                 // These convert a ray into a color even when no balls were struck by the ray.
          { waves: function( ray )
            { return Color( .5*Math.pow( Math.sin( 2*ray.dir[0] ), 4 ) + Math.abs( .5*Math.cos( 8*ray.dir[0] + Math.sin( 10*ray.dir[1] ) + Math.sin( 10*ray.dir[2] ) ) ),
                            .5*Math.pow( Math.sin( 2*ray.dir[1] ), 4 ) + Math.abs( .5*Math.cos( 8*ray.dir[1] + Math.sin( 10*ray.dir[0] ) + Math.sin( 10*ray.dir[2] ) ) ),
                            .5*Math.pow( Math.sin( 2*ray.dir[2] ), 4 ) + Math.abs( .5*Math.cos( 8*ray.dir[2] + Math.sin( 10*ray.dir[1] ) + Math.sin( 10*ray.dir[0] ) ) ), 1 );
            },
            lasers: function( ray ) 
            { var u = Math.acos( ray.dir[0] ), v = Math.atan2( ray.dir[1], ray.dir[2] );
              return Color( 1 + .5 * Math.cos( 20 * ~~u  ), 1 + .5 * Math.cos( 20 * ~~v ), 1 + .5 * Math.cos( 8 * ~~u ), 1 );
            },
            mixture:     ( function( ray ) { return mult_3_coeffs( this.background_functions["waves" ]( ray ), 
                                                                   this.background_functions["lasers"]( ray ) ).concat(1); } ).bind( this ),
            ray_direction: function( ray ) { return Color( Math.abs( ray.dir[ 0 ] ), Math.abs( ray.dir[ 1 ] ), Math.abs( ray.dir[ 2 ] ), 1 );  },
            color:       ( function( ray ) { return this.background_color;  } ).bind( this )
          };       
        this.make_menu();
        this.load_case( "show_homework_spec" );
      },
    'get_dir'( ix, iy )   
      {
         var a = ix/this.width;
         var b = iy/this.height;
         var x1 = a * (this.right - this.left);
         var y1 = b * (this.top - this.bottom);
         var x = this.left + x1;
         var y = this.bottom + y1;
         var z = -1 * this.near;
         return normalize(vec4( x, y, z, 0 ));
      },
    'color_missed_ray'( ray ) { return mult_3_coeffs( this.ambient, this.background_functions[ this.curr_background_function ] ( ray ) ).concat(1); },
    'trace'( ray, color_remaining, is_primary, light_to_check = null )
      { 
        if( length( color_remaining ) < .3 )  return Color( 0, 0, 0, 1 );  
        var closest_intersection = { distance: Number.POSITIVE_INFINITY, ball: null, normal: null }
         
        // Use argument is_primary to indicate whether this is the original ray or a recursion. 
        // if is primary ray, z = -1
        if(is_primary) {
          for(let b of this.balls)  closest_intersection = b.intersect(ray, closest_intersection, 1.0);
        } else {
          // else give 0.00005 to make it more accurate
          for(let b of this.balls) closest_intersection = b.intersect(ray, closest_intersection, 0.00005);
        }
        var most_close_ball = closest_intersection.ball;  
        //check shadow array 
        if(!light_to_check && !is_primary) {
          return most_close_ball;
        }
 
        // when there is intersection, we want to check (1)shadow (2)inflection (3)infraction
        if(most_close_ball) {
         var my_surface_color = most_close_ball.color.slice(0, 3);
         my_surface_color[0] = my_surface_color[0] * most_close_ball.k_a;
         my_surface_color[1] = my_surface_color[1] * most_close_ball.k_a;
         my_surface_color[2] = my_surface_color[2] * most_close_ball.k_a;
         /*
         vec3 my_surface_color = k_a * sphere color + for each point light source (p) {
                this.lights[p].color * (
                               k_d * ( N dot L, positive only) * (the sphere's color) +
                              k_s * ( (N dot H)^n, positive only) * white ) }
         */
          var norm = normalize(closest_intersection.normal.slice(0, 3));  
          var intersect_position = add(ray.origin.slice(0, 3), scale_vec(closest_intersection.distance, ray.dir.slice(0, 3))); 
          var view_V = normalize(subtract(ray.origin.slice(0, 3), intersect_position));  
          var insert_ray = normalize(subtract(intersect_position, ray.origin.slice(0, 3))); 
           
          for(let my_light of this.lights) {
            var my_light_origin = intersect_position;      
            var my_light_color = my_light.color.slice(0, 3);  
            var my_light_dir = subtract(my_light.position.slice(0, 3), my_light_origin);  
            var normalized_l = normalize(my_light_dir);       
            var my_light_ray = {origin: my_light_origin.concat(1), dir: my_light_dir.concat(0)};    
             // shadow is a boolean value indicates that if the ray is shadow, if it is, shadow = true
            var shadow = this.trace(my_light_ray, color_remaining, false, false); 
            /*
            when shadow is true, we don't need to consider about the influence on the surface color,
            we only counts this when it is not shadow
            */
            var white_color = vec3(1, 1, 1);
            if(!shadow) {
                        /*
                              vec3 my_surface_color = k_a * sphere color + for each point light source (p) {
                              this.lights[p].color * (
                              k_d * ( N dot L, positive only) * (the sphere's color) +
                              k_s * ( (N dot H)^n, positive only) * white ) }
                        */
                        var NDotL = dot(norm, normalized_l);       
                        var R = normalize(subtract(scale_vec(2 * NDotL, norm.slice(0, 3)), normalized_l));   //normalize the direction of reflection of light
                        var RDotV = dot(R, view_V);
                        var diffuse = scale_vec(most_close_ball.k_d * NDotL, 
                              vec3(my_light_color[0] * most_close_ball.color[0], 
                              my_light_color[1] * most_close_ball.color[1], my_light_color[2] * most_close_ball.color[2])).slice(0, 3);
                        var specular = scale_vec(most_close_ball.k_s * Math.pow(RDotV, most_close_ball.n), 
                              vec3(my_light_color[0] * white_color[0], 
                              my_light_color[1] * white_color[1], my_light_color[2] * white_color[2])
                              ).slice(0, 3);
                        my_surface_color = add(my_surface_color, NDotL > 0.0 ? diffuse : vec3(0 ,0, 0));
                        my_surface_color = add(my_surface_color, RDotV > 0.0 ? specular : vec3(0 ,0, 0));
                      }
 
          }
          if (my_surface_color[0] > 1.0) my_surface_color[0] = 1.0;
          else if(my_surface_color[0] < 0.0) my_surface_color[0] = 0.0;

          if (my_surface_color[1] > 1.0) my_surface_color[1] = 1.0;
          else if(my_surface_color[1] < 0.0) my_surface_color[1] = 0.0;

          if (my_surface_color[2] > 1.0) my_surface_color[2] = 1.0;
          else if(my_surface_color[2] < 0.0) my_surface_color[2] = 0.0;
 
          /* 
            vec3 pixel_color = my_surface_color + (white - my_surface_color) *
            ( k_r * trace().slice(0,3) + k_refract * trace().slice(0,3) )
            In order to calculate reflect light, use the equation R = I + 2U = I + 2(n' - I) = 2(N dot I) N - I
          */
          var NDotI = dot(norm, view_V);
          var tmp_i = 2 * NDotI; 
          var reflect_ray_direction = normalize(
                  subtract(scale_vec(tmp_i, norm), view_V).concat(0));   
          // this is the reflect ray, the origin is the intersect position, because it is a point so concat 1
          var reflect_ray = {origin: intersect_position.concat(1), dir: reflect_ray_direction}; 

          var complement = subtract(vec3(1, 1, 1), my_surface_color.slice(0, 3));                  
          var temp_0 = scale_vec(most_close_ball.k_r, color_remaining);                                      
          var reflect_color = this.trace(reflect_ray, mult_3_coeffs(temp_0, complement), false, true);
          var s_reflect_color = scale_vec(most_close_ball.k_r, reflect_color.slice(0, 3));
            /*
            Snell's law: sin(theta1) / sin(theta2) = n2 / n1
            V(refraction) = (n1 / n2) * l + ((n1 / n2) * cos(theta1) -cos(theta2)) * n
            substitute sphere's refraction index for (n1/n2)
            V(refraction) = r * l + (r * c - sqrt(1 - r^2(1 - c^2))) * n
            */
          var ball_index = most_close_ball.refract_index;
          var rMulL = scale_vec(ball_index, insert_ray);
          // c = - n dot l
          var c = - dot(norm, insert_ray);
          var rMulc = ball_index * c;

          // (1 - r^2(1 - c^2))
          // r * c - sqrt(1 - r^2(1 - c^2))
          // (r * c - sqrt(1 - r^2(1 - c^2))) * n
          var a_value = 1 - ball_index * ball_index * (1 - c * c);
          var rc_minus_sqrt_value = rMulc - Math.sqrt(a_value > 0? a_value : 0);
          var my_agagin_rc_minus_sqrt_value = scale_vec(rc_minus_sqrt_value, norm);
          var tmp_my_agagin_rc_minus_sqrt_value = add(rMulL, my_agagin_rc_minus_sqrt_value)
          var refract_direction = normalize(tmp_my_agagin_rc_minus_sqrt_value);
          var refract_ray = {origin: intersect_position.concat(1), dir: refract_direction.concat(0)};
          var temp_1 = scale_vec(most_close_ball.k_refract, color_remaining);
          var new_color_remaining_value1 = temp_1[0] * complement[0];
          var new_color_remaining_value2 = temp_1[1] * complement[1];
          var new_color_remaining_value3 = temp_1[2] * complement[2];
          var refract_color = this.trace(refract_ray, [new_color_remaining_value1 , 
                        new_color_remaining_value2 ,new_color_remaining_value3 ], false, true);
     
          var my_tmp_refraction_color = scale_vec(most_close_ball.k_refract, refract_color.slice(0, 3));
          var sum_reflect_and_refract = add(s_reflect_color, my_tmp_refraction_color);
          var subtractcolor = subtract(white_color, my_surface_color);
          var almost_result = 
            vec3(subtractcolor[0] * sum_reflect_and_refract[0], 
              subtractcolor[1] * sum_reflect_and_refract[1], subtractcolor[2] * sum_reflect_and_refract[2]);


          var pixel_color = add(my_surface_color, almost_result).concat(1);
          return pixel_color;
        } 

        
        return this.color_missed_ray(ray);
      },
    'parse_line'( tokens )            // Load the lines from the textbox into variables
      { for( let i = 1; i < tokens.length; i++ ) tokens[i] = Number.parseFloat( tokens[i] );
        switch( tokens[0] )
          { case "NEAR":    this.near   = tokens[1];  break;
            case "LEFT":    this.left   = tokens[1];  break;
            case "RIGHT":   this.right  = tokens[1];  break;
            case "BOTTOM":  this.bottom = tokens[1];  break;
            case "TOP":     this.top    = tokens[1];  break;
            case "RES":     this.width             = tokens[1];   this.height            = tokens[2]; 
                            this.scratchpad.width  = this.width;  this.scratchpad.height = this.height; break;
            case "SPHERE":
              this.balls.push( new Ball( [tokens[1], tokens[2], tokens[3]], [tokens[4], tokens[5], tokens[6]], [tokens[7],tokens[8],tokens[9]], 
                                          tokens[10],tokens[11],tokens[12],  tokens[13],tokens[14],tokens[15],  tokens[16] ) ); break;
            case "LIGHT":   this.lights.push( new Light( [ tokens[1],tokens[2],tokens[3], 1 ], Color( tokens[4],tokens[5],tokens[6], 1 ),    10000000 ) ); break;
            case "BACK":    this.background_color = Color( tokens[1],tokens[2],tokens[3], 1 ); this.gl.clearColor.apply( this.gl, this.background_color ); break;
            case "AMBIENT": this.ambient = [tokens[1], tokens[2], tokens[3]];          
          }
      },
    'parse_file'()        // Move through the text lines
      { this.balls = [];   this.lights = [];
        this.scanline = 0; this.scanlines_per_frame = 1;                            // Begin at bottom scanline, forget the last image's speedup factor
        document.getElementById("progress").style = "display:inline-block;";        // Re-show progress bar
        this.camera_needs_reset = true;                                             // Reset camera
        var input_lines = document.getElementById( "input_scene" ).value.split("\n");
        for( let i of input_lines ) this.parse_line( i.split(/\s+/) );
      },
    'load_case'( i ) {   document.getElementById( "input_scene" ).value = test_cases[ i ];   },
    'make_menu'()
      { document.getElementById( "raytracer_menu" ).innerHTML = "<span style='white-space: nowrap'> \
          <button id='toggle_raytracing' class='dropbtn' style='background-color: #AF4C50'>Toggle Ray Tracing</button> \
          <button onclick='document.getElementById(\"myDropdown2\").classList.toggle(\"show\"); return false;' class='dropbtn' style='background-color: #8A8A4C'> \
          Select Background Effect</button><div  id='myDropdown2' class='dropdown-content'>  </div>\
          <button onclick='document.getElementById(\"myDropdown\" ).classList.toggle(\"show\"); return false;' class='dropbtn' style='background-color: #4C50AF'> \
          Select Test Case</button        ><div  id='myDropdown' class='dropdown-content'>  </div> \
          <button id='submit_scene' class='dropbtn'>Submit Scene Textbox</button> \
          <div id='progress' style = 'display:none;' ></div></span>";
        for( let i in test_cases )
          { var a = document.createElement( "a" );
            a.addEventListener("click", function() { this.load_case( i ); this.parse_file(); }.bind( this    ), false);
            a.innerHTML = i;
            document.getElementById( "myDropdown"  ).appendChild( a );
          }
        for( let j in this.background_functions )
          { var a = document.createElement( "a" );
            a.addEventListener("click", function() { this.curr_background_function = j;      }.bind( this, j ), false);
            a.innerHTML = j;
            document.getElementById( "myDropdown2" ).appendChild( a );
          }
         
        document.getElementById( "input_scene" ).addEventListener( "keydown", function(event) { event.cancelBubble = true; }, false );
         
        window.addEventListener( "click", function(event) {  if( !event.target.matches('.dropbtn') ) {    
          document.getElementById( "myDropdown"  ).classList.remove("show");
          document.getElementById( "myDropdown2" ).classList.remove("show"); } }, false );
 
        document.getElementById( "toggle_raytracing" ).addEventListener("click", this.toggle_visible.bind( this ), false);
        document.getElementById( "submit_scene"      ).addEventListener("click", this.parse_file.bind(     this ), false);
      },
    'toggle_visible'() { this.visible = !this.visible; document.getElementById("progress").style = "display:inline-block;" },
    'set_color'( ix, iy, color )                           // Sends a color to one pixel index of our final result
      { var index = iy * this.width + ix;
        this.imageData.data[ 4 * index     ] = 255.9 * color[0];    
        this.imageData.data[ 4 * index + 1 ] = 255.9 * color[1];    
        this.imageData.data[ 4 * index + 2 ] = 255.9 * color[2];    
        this.imageData.data[ 4 * index + 3 ] = 255;  
      },
    'init_keys'( controls ) { controls.add( "SHIFT+r", this, this.toggle_visible ); },
    'display'( graphics_state )
      { graphics_state.lights = this.lights;
        graphics_state.projection_transform = perspective(90, 1, 1, 1000);
        if( this.camera_needs_reset ) { graphics_state.camera_transform = identity(); this.camera_needs_reset = false; }
        //console.log(b.model_transform); ///
        if( !this.visible )                          // Raster mode, to draw the same shapes out of triangles when you don't want to trace rays
        { for( let b of this.balls ) this.shapes.sphere.draw( graphics_state, b.model_transform, this.shader.material( b.color.concat(1), b.k_a, b.k_d, b.k_s, b.n ) );
          this.scanline = 0;     document.getElementById("progress").style = "display:none";     return; 
        } 
        if( !this.texture || !this.texture.loaded ) return;      // Don't display until we've got our first procedural image
        this.scratchpad_context.drawImage( this.texture.image, 0, 0 );
        this.imageData = this.scratchpad_context.getImageData( 0, 0, this.width, this.height );    // Send the newest pixels over to the texture
        var camera_inv = inverse( graphics_state.camera_transform );
         
        var desired_milliseconds_per_frame = 100;
        if( ! this.scanlines_per_frame ) this.scanlines_per_frame = 1;
        var milliseconds_per_scanline = Math.max( graphics_state.animation_delta_time / this.scanlines_per_frame, 1 );
        this.scanlines_per_frame = desired_milliseconds_per_frame / milliseconds_per_scanline + 1;
        for( var i = 0; i < this.scanlines_per_frame; i++ )     // Update as many scanlines on the picture at once as we can, based on previous frame's speed
        { var y = this.scanline++;
          if( y >= this.height ) { this.scanline = 0; document.getElementById("progress").style = "display:none" };
          document.getElementById("progress").innerHTML = "Rendering ( " + 100 * y / this.height + "% )..."; 
          for ( var x = 0; x < this.width; x++ )
          { var ray = { origin: mult_vec( camera_inv, vec4(0, 0, 0, 1) ), dir: mult_vec( camera_inv, this.get_dir( x, y ) ) };   // Apply camera
            this.set_color( x, y, this.trace( ray, [1,1,1], true ) );                                    // ******** Trace a single ray *********
          }
        }
        this.scratchpad_context.putImageData( this.imageData, 0, 0);          // Draw the image on the hidden canvas
        this.texture.image.src = this.scratchpad.toDataURL("image/png");      // Convert the canvas back into an image and send to a texture
         
        this.shapes.square.draw( new Graphics_State( identity(), identity(), 0 ), translation(0,0,-1), this.shader.material( Color( 0, 0, 0, 1 ), 1,  0, 0, 1, this.texture ) );
      }
  }, Scene_Component );