// ******Initalize page on load with saved data

// fucntion to get specified global variable | await getStoredGlobalValue('Current Bits')
async function getStoredGlobalValue(variableName) {
  const response = await fetch('http://localhost:7777/aitum/state');
  const globalVars = await response.json();
  const findVar = await globalVars.data.find(v => v.name === variableName);
  
  return findVar ? findVar.value : null
}

//function to get stored colors
async function getStoredColorValue(variableName) {
  const response = await fetch('/cjdb');
  const globalVars = await response.json();
  const value = globalVars[variableName];
  return value ? value : null;
}



// do math for bit percentage (current bits / bit goal ) x 100 = x%
// create variables from getStoredGlobalValue function before doing math (because chat knows best prectices <3)
const curBit = await getStoredGlobalValue('Current Bits');
const bitGo = await getStoredGlobalValue('Bit Goal');
// do the maths!
const bitPercentage = (curBit / bitGo) * 100;

// push stored bit goal to html div
document.querySelector(".goalTotal").insertAdjacentText('beforeend', `${await (getStoredGlobalValue('Bit Goal'))}`);

// push stored bit percentage to html div
document.querySelector(".percentage").innerHTML = `${Math.round(bitPercentage)}%`;

// push stored bit percentage to css 
const root = document.querySelector(':root');
const rs = getComputedStyle(root);
root.style.setProperty('--progress', `${bitPercentage}` + '%');

//progress bar background gradient colors
const color0 = await getStoredColorValue('color0')
console.log("Color0:", await getStoredColorValue('color0'))
root.style.setProperty('--color0', `${color0}`);

const color1 = await getStoredColorValue('color1')
console.log("Color1:", await getStoredColorValue('color1'))
root.style.setProperty('--color1', `${color1}`);

// progress bar forground gradient colors
const color2 = await getStoredColorValue('color2')
console.log("Color2:", await getStoredColorValue('color2'))
root.style.setProperty('--color2', `${color2}`);

const color3 = await getStoredColorValue('color3')
console.log("Color3:", await getStoredColorValue('color3'))
root.style.setProperty('--color3', `${color3}`);

// progress bar bow shadow color
const color4 = await getStoredColorValue('color4')
console.log("Color4:", await getStoredColorValue('color4'))
root.style.setProperty('--color4', `${color4}`);


// log goal, bits, percent
console.log('Stored Goal:', await getStoredGlobalValue('Bit Goal'));
console.log('Stored Current Bits:', await getStoredGlobalValue('Current Bits'));
console.log('Stored Percentage:', bitPercentage);



if(bitPercentage >= 90){
  const rage = 1;
  root.style.setProperty('--dur', `${rage}` + 's');
  console.log('Rage Bool:', rage);
}else{
  const rage = 0;
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
          const r = document.querySelector(':root');

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

        socket.on("pbwSavedColors", (colors) => {
          const color0 = colors.color0;
          const color1 = colors.color1;
          const color2 = colors.color2;
          const color3 = colors.color3;
          const color4 = colors.color4;
          console.log('Color0 is:', color0);
          console.log('Color1 is:', color1);
          root.style.setProperty('--color0', color0);
          root.style.setProperty('--color1', color1);
          root.style.setProperty('--color2', color2);
          root.style.setProperty('--color3', color3);
          root.style.setProperty('--color4', color4);
        });

        socket.on("radiusSlider", (slider) => {
          console.log('Radius set to:', slider);
          root.style.setProperty('--radius', slider + "px");

        });


