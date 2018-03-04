• [4 points] Make use of hierarchical objects with at least three levels (e.g., a human arm)
Human arm: 
level 1: draw user, in here I call function to dram arm
level 2: draw  upper arm and draw lower arm
level 3: in the draw lower arm, I call function to draw hand

• [4 points] Demonstrate the camera tracking a moving object sometime, by overwriting the camera matrix using lookAt() .

While the player is eating, professor will go out of the classroom, before he goes out, he will shrink the size(indicating that he is 
going to go out the room)
At that time, the camera tracks the moving of the professor.

• [6 points] Design polygonal objects of your own to supplement the existing ones. To specify these shapes you must providenovel positions, normals, and texture coordinates to the graphics card by extending class Shape().

see myPoly() in example-shapes.js

• [2 points] Assign reasonable texture coordinates to, and texture, an instance of your custom polygonal object. Either texture itby mapping an image file, or procedurally (more like the Funny_Shader demo).

see poly in function draw_my_own_poly in example-scene-components

• [2 points] Your texture coordinates from the previous step must be designed to create an abrupt transition (discontinuity) alongsome edge(s) of the shape. Flat shading should be evident there when drawn and lit with the provided Phong reflection model.Explain in your README where to look for it.

see myPoly() in example-shapes.js
see poly in function draw_my_own_poly in example-scene-components

credit to Jiayu Guo, we discussed together and you can refer to the discussion.jpeg in the zip file to see our draft


• [2 points] Real-time speed. Make sure that your animation runs at the same speed i.e., one simulated second correspondsroughly to one real second regardless of the machine your program runs on (even a ridiculously fast one from the future). Thevariable animation_time inside the graphics_state object is your gauge of the passage of real seconds.

        var t = graphics_state.animation_time/1000;
• [2 points] Display the frame rate of your program on the graphics window, taking advantage of the update_strings() method thateach Scene_Component object runs each frame.

see the update_strings() method
• [4 points] Creativity (story, aesthetic style, etc).

This game is in the story that the player just came to the class after played basketball, he needs some food to provide energy,(press 0 to eat food)
you can see the energy bar at the left bottom corner, if the user press 0, then he will eat some foods otherwise he will keep losing 
energy, if the energy becomes really low then the player will die or if he’s not full at the required time, he will also die and thus game failed.
If the player was caught by professor(at the time professor is moving), he would lose energy and thus game failed.
If the player eats really quick and then he will win the game.
• [4 points] Complexity and impressive underlying mechanics.• [5 points] Overall quality: Fluidity of object and camera motion, attention to detail in scene construction, etc.• [For participation in the in-class screening and contest] Make and submit a movie of your animation (length 90 sec or less) usingyour favorite screen recording application (e.g., camstudio/quicktime). If your program is interactive, submit a video of it beingused. Make sure you encode your movie to be below the CCLE limit of 100MB, and observe the 90s limit.