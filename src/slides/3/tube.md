
 radialSegments = 3 means 3 sides around the tube, not 3 indices total.         
                                                                                
 For each side around the tube, TubeGeometry builds a quad between two rings:   
                                                                                
 ```txt                                                                         
   ring A        ring B                                                         
                                                                                
   A0 -------- B0                                                               
    |          |                                                                
   A1 -------- B1                                                               
 ```                                                                            
                                                                                
 That rectangle/quad is one side face of the tube.                              
                                                                                
 But WebGL renders triangles, not quads. So each quad becomes 2 triangles:      
                                                                                
 ```txt                                                                         
   triangle 1: A0, B0, A1                                                       
   triangle 2: B0, B1, A1                                                       
 ```                                                                            
                                                                                
 Each triangle has 3 indices:                                                   
                                                                                
 ```txt                                                                         
   2 triangles * 3 indices = 6 indices per radial side                          
 ```                                                                            
                                                                                
 So per tubular segment:                                                        
                                                                                
 ```ts                                                                          
   indicesPerTubularSegment = radialSegments * 6                                
 ```                                                                            
                                                                                
 For radialSegments = 3:                                                        
                                                                                
 ```ts                                                                          
   3 * 6 = 18 indices                                                           
 ```                                                                            
                                                                                
 That’s one triangular-prism slice along the tube.                              

                                                                                
 i don't understand the whole quad thing. where are these quads? i thought      
 cross section is a circle                                                      
                                                                                

 The cross-section is approximated as a polygon, not a true circle.             
                                                                                
 If:                                                                            
                                                                                
 ```ts                                                                          
   radialSegments = 8                                                           
 ```                                                                            
                                                                                
 the “circle” cross-section is really 8 points around a ring:                   
                                                                                
 ```txt                                                                         
      1---2                                                                     
    /       \                                                                   
   0         3                                                                  
   |         |                                                                  
   7         4                                                                  
    \       /                                                                   
      6---5                                                                     
 ```                                                                            
                                                                                
 TubeGeometry places one ring at each step along the curve:                     
                                                                                
 ```txt                                                                         
   ring A          ring B                                                       
                                                                                
     A1---A2        B1---B2                                                     
    /       \      /       \                                                    
   A0       A3 -- B0       B3                                                   
   |        |      |        |                                                   
   A7       A4 -- B7       B4                                                   
    \      /        \      /                                                    
     A6---A5        B6---B5                                                     
 ```                                                                            
                                                                                
 Now connect matching edges between neighboring rings.                          
                                                                                
 One side face is:                                                              
                                                                                
 ```txt                                                                         
   A0 ---- B0                                                                   
   |       |                                                                    
   A1 ---- B1                                                                   
 ```                                                                            
                                                                                
 That 4-corner face is the quad.                                                
                                                                                
 But GPUs render triangles, not quads, so Three splits that quad into two       
 triangles:                                                                     
                                                                                
 ```txt                                                                         
   A0 ---- B0                                                                   
   | \     |                                                                    
   |   \   |                                                                    
   A1 ---- B1                                                                   
 ```                                                                            
                                                                                
 So:                                                                            
                                                                                
 ```txt                                                                         
   one radial side = one quad = two triangles = six indices                     
 ```                                                                            
                                                                                
 If radialSegments = 8, there are 8 quads around each tube segment.             
                                                                                
 If radialSegments = 3, the cross-section is triangular, so each tube segment   
 is a triangular prism with 3 rectangular side faces.                           
