let canvasX=640;
let canvasY=360;

function tline(size){
  line(0,0,size,0);
}

class Arrow {
  constructor(x1,y1,x2,y2, color){
    this.x1=x1;
    this.x2=x2;
    this.y1=y1;
    this.y2=y2;
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

function setup() {
  // put setup code here
    createCanvas(canvasX,canvasY);
    arrow1 = new Arrow(100,200,120,150,'#0066ff');
}

function draw() {
  // put drawing code here
}
