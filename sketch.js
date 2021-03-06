let canvasX=640;
let canvasY=360;
let workspaceColor="#333333";
let sideMargin=[20,20,5,20];

function tline(size){
  line(0,0,size,0);
}

class Arrow {
  constructor(x1,y1,x2,y2, color){
    this.x1=x1;
    this.x2=x2;
    this.y1=-y1;
    this.y2=-y2;
    this.color = color;
    var angle = atan2(this.y2-this.y1,this.x2-this.x1);
    var size = sqrt(pow(this.x2-this.x1,2) + pow(this.y2-this.y1,2));

    push();
      // Drawing arrow body
      translate(this.x1, this.y1);
      rotate(angle);
      stroke(this.color);
      tline(size);

      // Drawing arrow tip
      translate(size,0);
      push();
        rotate(radians(35));
        tline(-5);
      pop();
      push();
        rotate(radians(-35));
        tline(-5);
      pop();
    pop();
  }
}

function vArrow (size, inverted=false, color){
  if(inverted) {
    new Arrow(0,size,0, 0, color);
  } else
    new Arrow(0,0,0, size, color);
}

// Least Common Multiplier, to get the hyperperiod
function lcm(input_array) {
    if (toString.call(input_array) !== "[object Array]")  
        return  false;  
 var r1 = 0, r2 = 0;
    var l = input_array.length;
    for(i=0;i<l;i++) {
        r1 = input_array[i] % input_array[i + 1];
        if(r1 === 0) {
            input_array[i + 1] = (input_array[i] * input_array[i+1]) / input_array[i + 1];
        }
        else {
            r2 = input_array[i + 1] % r1;
            if(r2 === 0) {
                input_array[i + 1] = (input_array[i] * input_array[i + 1]) / r1;
            }
            else {
                input_array[i+1] = (input_array[i] * input_array[i + 1]) / r2;
            }
        }
    }
    return input_array[l - 1];
}

class Workspace {
  constructor(staticTasks, servers, hyperperiod){
    textFont('Open Sans');
    // translate to workspace's (0,0)
    translate(sideMargin[0], canvasY-sideMargin[2]-sideMargin[3]);

    // The x axis will be drawn by the first task
    this.yAxis = new Arrow (0, 0, 0, canvasY-sideMargin[3]-2*sideMargin[2], workspaceColor);
    
    this.nbStaticTasks = staticTasks;
    this.nbServers = servers;

    // The task size will be used to space out tasks vertically on the workspace
    // A server's size will be 1.5x larger
    this.taskSize = (canvasY-sideMargin[2]-sideMargin[3]-7)/(this.nbStaticTasks + 1.5*this.nbServers);
    
    this.xSlots=[];
    this.SySlots=[]; // y slots for servers
    this.TySlots=[]; // y slots for static tasks

    // Master clock
    this.clock=0;

    let s = 0;

    // Begin tasks horizontal arrows drawing
    push();
      // Draw servers first
      for (s = 0; s<this.nbServers; s++) {
        this.SySlots[s] = Math.trunc(s*1.5*this.taskSize);

        this.drawTaskArrow(0 == s,hyperperiod); // 0 == s -> if it is the first slot, draw x axis numbers
        text("s"+(s+1), -15, -(1.5*this.taskSize)/2+5);
        translate(0, -1.5*this.taskSize);
      }
      // Remember, s finishes at nbServers
      
      // Then draw static tasks
      for(let i = 0; i<this.nbStaticTasks; i++){
        let isFirstSlot = false;
        if(s>0){ // If there were previously drawn servers
          if(0==i){
            // The first slot should give space to the following server
            this.TySlots[i] = this.SySlots[s-1]+this.taskSize*1.5;
          }
          if(i>0){
           this.TySlots[i] = this.TySlots[i-1] + this.taskSize;
          }
        }
        else {
          this.TySlots[i] = Math.trunc(i*this.taskSize);
          isFirstSlot = true;
        }

        this.drawTaskArrow(isFirstSlot, hyperperiod);
        text("t"+(i+1), -15, -this.taskSize/2+5);
        translate(0, -this.taskSize);
      }
    pop();
  }

  clk(){
    this.clock++;
    // May need to redraw at some point, we'll see
  }

  // Draws tasks horizontal arrows and uses vGrad to draw the graduations
  drawTaskArrow(isFirstSlot, hyperperiod) {
    let size = canvasX-sideMargin[0]-sideMargin[1];
    new Arrow(0, 0, size, 0, workspaceColor);

    push();
      stroke(workspaceColor);
      for (let i = 1; i<=hyperperiod; i++){
        translate(size/hyperperiod, 0);
        if(i%5) {
          if(i != hyperperiod)
            this.vGrad(); // normal graduation
        }
        else {
          if(i != hyperperiod)
            this.vGrad('l'); // large one every 5
          if(isFirstSlot){ // Draw the numbers only on first ySlot
            textAlign(CENTER);
            textSize(10)
            text(i,0, 20);
          }
        }
      }
    pop();

    for (var i = 0; i <hyperperiod; i++) {
      this.xSlots[i] = i*size/hyperperiod;
    }
  }

  // Draws the vertical graduations and numbering
  vGrad(size='s') {
    var s=6;
    if ('l' == size) 
      s=12;
    line(0,s/2,0,-s/2);
  }

  // Goes to a specific task and slot. Usage: push();  goTo('s2', 8); pop();
  goTo(task, xslot) {
    if((task[1] > 0) || (task[0] == 's' && task[1]>this.nbServers) || (task[0] == 't' && task[1]>this.nbStaticTasks)){
      if('s' == task[0]) { // If we ask for a server slot
        translate(this.xSlots[xslot], -this.SySlots[parseInt(task[1])-1]);
      } else {
        translate(this.xSlots[xslot], -this.TySlots[parseInt(task[1])-1]);
      }
    } else { 
      console.log('Invalid task designator in goTo');
    }
  }
  // Draws deadline arrow
  ai(task, xslot, inverted=false, color="#ff8888"){
    let size;
    if('s' == task[0]){
      size = 1.2*this.taskSize;
    }
    else {
      size = 0.7*this.taskSize;
    }
    push();
      this.goTo(task, xslot);
      vArrow(size, inverted, color);
    pop();
  }


  /** GRAPHICS USERLAND FROM HERE**/

  // Draws deadline arrows
  di(task, xslot){
    this.ai(task, xslot, true, "#ff8888");
  }
  // Release time arrows
  ri(task, xslot) {
    this.ai(task, xslot, false, "#44dc44");
  }
  // Period arrows
  ti(task, xslot) {
    this.ai(task, xslot, false, "#0066ff");
  }
  // Constrained deadline arrow
  cdi(task, xslot){
    this.ai(task, xslot, false, "#886688");
    this.ai(task, xslot, true, "#886688");
  }

  step(task){
    let size;
    if('s' == task[0]){
      size = 1.2*this.taskSize;
    }
    else {
      size = 0.7*this.taskSize;
    }
    push();
      fill(204, 101, 192, 127);
      stroke(127, 63, 120, 100);
      this.goTo(task, this.clock);
      rect(0,0,this.xSlots[1]-this.xSlots[0],-size);
    pop();
  }

}

function setup() {
  // put setup code here
    createCanvas(canvasX,canvasY);
    ws = new Workspace(5, 2, lcm([9,3,4]));
    ws.cdi('t1', 4);
    ws.ri('s2', 3);
    ws.ti('t1', 6);
    ws.step('s1');
    ws.clk();
    ws.step('t2');
    ws.step('s1');
    ws.clk();
    ws.step('t5');
    ws.clk();
    ws.step('t1');
    ws.clk();
    ws.clk();
    ws.step('t1');



}

function draw() {
  // put drawing code here
}
