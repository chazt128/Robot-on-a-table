// Creating Robot image element
const robot = document.createElement("img");
robot.src = "robot.png";
robot.id = 'robot';
robot.style.width = "50px";

// Initializing coordinate default (0,0,NORTH)
let x = 0;
let y = 0;
let f = 180;

// Directions for Report, console.log, and Output 
const facings = {
    0: 'SOUTH',
    90: 'WEST',
    180: 'NORTH',
    270: 'EAST'
}

// Boolean if Robot was active at least once
let robotWasActivated = false;
// Boolean if Robot is currently active
let robotActive = false;

// Place function to set Robot position values
const place = (inX, inY, inF) => {
    // If somehow, invalid inputs are passed in, keep coordinates to the default (0,0,NORTH)
    x = (inX < 0 || inX > 4) ? 0 : inX;
    y = (inY < 0 || inY > 4) ? 0 : inY;
    f = (!facings[inF]) ? 180 : inF;
    console.log(`PLACE ${x},${y},${facings[f]}-${f}`);
}

// Move function to move Robot by one unit depending on direction facing
const move = () => {
    switch(f) {
        // If trying to move past edge of table, do not increment/decrement
        case 0: // South
            if(y !== 0) y--;
            break;
        case 90: // West
            if(x !== 0) x--;
            break;
        case 180: // North
            if(y !== 4) y++;
            break;
        case 270: // East
            if(x !== 4) x++;
            break;
    }
    console.log(`MOVE ${x},${y},${facings[f]}-${f}`);
}

// Left function to rotate Robot counter-clockwise
const left = () => {
    // Handle f (angle) if f is currently 0 since left rotation subtracts 90 deg
    f = f === 0 ? 270 : f-90;
    console.log(`LEFT ${facings[f]}-${f}`);
}

// Right function to rotate Robot clockwise
const right = () => {
    // Handle f (angle) if f is currently 270 since right rotation adds 90 deg
    f = f === 270 ? 0 : f+90;
    console.log(`RIGHT ${facings[f]}-${f}`);
}

// Report function to display Robot's current position
const report = () => {
    // Needed for console logging and index.test.js
    console.log(`REPORT ${x},${y},${facings[f]}-${f}`);
}

// Setting a rounded border which is used to indicate the direction the Robot is facing
const setFace = () => {
    // Border to act as direction indicator with respect to current angle
    let facingIndicator = {
        0: 'border-bottom',
        90: 'border-left',
        180: 'border-top',
        270: 'border-right'
    }
    // When robot is being placed on the table for the first time
    if(!robot.classList.length) {
        robot.classList.add('border-primary','rounded-circle',facingIndicator[f]);
    } else {
        let face = robot.classList.item(2);
        // If the facing direction has changed, update border class
        if(face !== facingIndicator[f]) {
            robot.classList.remove(face);
            robot.classList.add(facingIndicator[f]);
        }
    }
}

// User interactions
$('#place').click(() => {
    // Get position values from place modal on web interface
    let inX = Number(document.getElementById('x').value);
    let inY = Number(document.getElementById('y').value);
    let inF = Number(document.getElementById('f').value);
    // Update Robot active state
    robotActive = true;
    robotWasActivated = true;
    // Update global x,y,f
    place(inX,inY,inF);
    // Set robot onto web interface table
    setFace();
    document.getElementById(`${x}${y}`).appendChild(robot);
    // Enabling other command buttons
    let robotCommands = document.getElementsByClassName('robot-commands');
    for(let i = 0; i < robotCommands.length; i++) {
        robotCommands[i].disabled = false;
    }
});

$('#move').click(() => { 
    if(robotActive && robotWasActivated) {
        let prevX = x;
        let prevY = y;
        move();
        // If the robot position has updated, reflect that change onto the table
        if(x != prevX || y != prevY) {
            document.getElementById(`${prevX}${prevY}`).removeChild(robot);
            document.getElementById(`${x}${y}`).appendChild(robot);
        }
    } 
});

$('#left').click(() => { 
    if(robotActive && robotWasActivated) {
        left(); 
        setFace();
    }
});

$('#right').click(() => { 
    if(robotActive && robotWasActivated) {
        right();
        setFace();
    }
});

$('#report').click(() => { 
    if(robotActive && robotWasActivated) {
        report();
        // Display robot position on the web interface
        document.getElementById('xReport').textContent = x;
        document.getElementById('yReport').textContent = y;
        document.getElementById('fReport').textContent = facings[f];
        document.getElementById('reportContainer').classList.remove('d-none');
    } 
});

// Handle closing Place Robot modal when clicking cancel, x, or outside and whether or not there's an active robot
$('#placeRobotModal').on('hidden.bs.modal', () => {
    // robotWasActive is a helper to robotActive to keep command button disabled while a robot has been present at least once
    robotActive = robotWasActivated ? true : false;
});
// Exporting functions for testing in index.test.js
module.exports = {
    place,
    move,
    left,
    right,
    report
}
