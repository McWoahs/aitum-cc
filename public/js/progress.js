// ******Initalize page on load with saved data

// get stored bit goal
async function getStoredGoal() {
  const response = await fetch('http://localhost:7777/aitum/state');
  const globalVars = await response.json();
  const currentGoal = await globalVars.data.find(v => v.name === 'Bit Goal');
  return currentGoal.value;
}
// get stored bits total
async function getStoredBits() {
  const response = await fetch('http://localhost:7777/aitum/state');
  const globalVars = await response.json();
  const currentBits = await globalVars.data.find(v => v.name === 'Current Bits')
  return currentBits.value;
}

// do math for bit percentage (current bits / bit goal ) x 100 = x%
var bitPercentage = (await getStoredBits()) / (await getStoredGoal()) * 100;

// push stored bit goal to html div
document.querySelector(".goalTotal").insertAdjacentText('beforeend', `${await (getStoredGoal())}`);

// push stored bit percentage to html div
document.querySelector(".percentage").innerHTML = `${Math.round(bitPercentage)}%`;

// push stored bit percentage to css 
var root = document.querySelector(':root');
var rs = getComputedStyle(root);
root.style.setProperty('--progress', `${bitPercentage}` + '%');

// log goal, bits, percent
console.log('Stored Goal:', await getStoredGoal());
console.log('Stored Current Bits:', await getStoredBits());
console.log('Stored Percentage:', bitPercentage);



// *******adjust page dynamically via socket io
const socket = io('http://localhost:3000')
        // confirm connection
        socket.on('connection', console.log('Connected to the server'));
        // receiving bit percentage from backend
        socket.on('bitPercentage', bitPercentage => {
          // value of vairable passed from backaend
          console.log('Percentage of goal complete:', bitPercentage);
          //  selecting :root to get css veriables
          var r = document.querySelector(':root');

          var rs = getComputedStyle(r);
          console.log("Old percentage: " + rs.getPropertyValue('--progress'));

          var rs = getComputedStyle(r);
          r.style.setProperty('--progress', `${bitPercentage}` + '%');
          console.log("New percentage:" + rs.getPropertyValue('--progress'));
          document.querySelector(".percentage").innerHTML = `${Math.round(bitPercentage)}%`;
        
        })

        
        socket.on('bitGoal', async bitGoal => {
          async function clearGoal() {
          document.querySelector(".goalTotal").innerHTML = 'Bit Goal:';
          }
          clearGoal();
          document.querySelector(".goalTotal").insertAdjacentText('beforeend', `${bitGoal}`);
          console.log("This is the bitGoal:", bitGoal.toString());
        })