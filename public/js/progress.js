// ******Initalize page on load with saved data

// fucntion to get specified global variable | await getStoredValue('Current Bits')
async function getStoredValue(variableName) {
  const response = await fetch('http://localhost:7777/aitum/state');
  const globalVars = await response.json();
  const findVar = await globalVars.data.find(v => v.name === variableName);
  
  return findVar ? findVar.value : null
}

// do math for bit percentage (current bits / bit goal ) x 100 = x%
// create variables from getStoredValue function before doing math (because chat knows best prectices <3)
const curBit = await getStoredValue('Current Bits');
const bitGo = await getStoredValue('Bit Goal');
// do the maths!
const bitPercentage = (curBit / bitGo) * 100;

// push stored bit goal to html div
document.querySelector(".goalTotal").insertAdjacentText('beforeend', `${await (getStoredValue('Bit Goal'))}`);

// push stored bit percentage to html div
document.querySelector(".percentage").innerHTML = `${Math.round(bitPercentage)}%`;

// push stored bit percentage to css 
const root = document.querySelector(':root');
var rs = getComputedStyle(root);
root.style.setProperty('--progress', `${bitPercentage}` + '%');



// log goal, bits, percent
console.log('Stored Goal:', await getStoredValue('Bit Goal'));
console.log('Stored Current Bits:', await getStoredValue('Current Bits'));
console.log('Stored Percentage:', bitPercentage);



if(bitPercentage >= 90){
  const rage = 1;
  var rs = getComputedStyle(root);
  root.style.setProperty('--dur', `${rage}` + 's');
  console.log('Rage Bool:', rage);
}else{
  const rage = 0;
  var rs = getComputedStyle(root);
  root.style.setProperty('--dur', `${rage}` + 's');
  console.log('Rage Bool:', rage);
}

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

          // log old percentage
          var rs = getComputedStyle(r);
          console.log("Old percentage: " + rs.getPropertyValue('--progress'));

          //set progress bar percentage in text and css / log new percentage
          var rs = getComputedStyle(r);
          r.style.setProperty('--progress', `${bitPercentage}` + '%');
          console.log("New percentage:" + rs.getPropertyValue('--progress'));
          document.querySelector(".percentage").innerHTML = `${Math.round(bitPercentage)}%`;
          
          //check percentage for rage emoji ( < 90 no rage | > 90 rage )
          if(bitPercentage >= 90){
            const rage = 1;
            var rs = getComputedStyle(root);
            root.style.setProperty('--dur', `${rage}` + 's');
            console.log(rage);
          }else{
            const rage = 0;
            var rs = getComputedStyle(root);
            root.style.setProperty('--dur', `${rage}` + 's');
            console.log(rage);
          }

        })

        //set the bit goal text (clear before updating with new value)
        socket.on('bitGoal', async bitGoal => {
          async function clearGoal() {
          document.querySelector(".goalTotal").innerHTML = 'Bit Goal:';
          }
          clearGoal();
          document.querySelector(".goalTotal").insertAdjacentText('beforeend', `${bitGoal}`);
          console.log("This is the bitGoal:", bitGoal.toString());
        })