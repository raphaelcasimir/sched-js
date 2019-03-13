let canvasX=640;
let canvasY=360;
let workspaceColor="#000000";
let sideMargin=[20,5,5,5];

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

class Workspace {
  constructor(staticTasks, servers){
    // translate to workspace's (0,0)
    translate(sideMargin[0], canvasY-sideMargin[2]);

    // The x axis will be drawn by the first task
    this.yAxis = new Arrow (0, 0, 0, (canvasY-sideMargin[3]-sideMargin[2]), workspaceColor);
    
    this.nbStaticTasks = staticTasks;
    this.nbServers = servers;

    // The task size will be used to space out tasks vertically on the workspace
    // A server's size will be 1.5x larger
    this.taskSize = (canvasY-sideMargin[2]+sideMargin[3]-5)/(this.nbStaticTasks + 1.5*this.nbServers);
    
    this.slots=[];
    let s = 0;

    // Begin tasks horizontal arrows drawing
    push();
      // Draw servers first
      for (s = 0; s<this.nbServers; s++) {
        this.slots[s] = Math.trunc(s*1.5*this.taskSize);

        new Arrow(0, 0, canvasX-sideMargin[0], 0, workspaceColor);
        text("s"+(s+1), -15, -(1.5*this.taskSize)/2+5);
        translate(0, -1.5*this.taskSize);
      }
      // Remember, s finishes at nbServers
      
      // Then draw static tasks
      for(let i = 0; i<this.nbStaticTasks; i++){
        if(s>0){ // If there were previously drawn servers
          if(0==i){
            // The first slot should give space to the following server
            this.slots[s] = this.slots[s-1]+this.taskSize*1.5;
          }
          if(i>0){
           this.slots[s+i] = this.slots[s+i-1] + this.taskSize;
          }
        }
        else {
          this.slots[i] = Math.trunc(i*this.taskSize);
        }

        new Arrow(0, 0, canvasX-sideMargin[0], 0, workspaceColor);
        text("t"+(i+1), -15, -this.taskSize/2+5);
        translate(0, -this.taskSize);
      }
    pop();
    for(var i=0; i<this.slots.length; i++)
      console.log(this.slots[i]/this.taskSize);
  }
}

function setup() {
  // put setup code here
    createCanvas(canvasX,canvasY);
    arrow1 = new Arrow(100,200,120,150,'#0066ff');
    workspace = new Workspace(4,2);
}

function draw() {
  // put drawing code here
}
