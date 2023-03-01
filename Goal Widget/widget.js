root = document.documentElement;
root.style.getPropertyValue("--change-meter-1");
root.style.getPropertyValue("--change-meter-2");
root.style.getPropertyValue("--change-meter-3");

root.style.setProperty("--change-meter-1", 100);
root.style.setProperty("--change-meter-2", 150);
root.style.setProperty("--change-meter-3", 150);

const meter1 = document.querySelector(".meter-1");
const meter2 = document.querySelector(".meter-2");
const meter3 = document.querySelector(".meter-3");

meter1.style.strokeDashoffset = "100";
meter2.style.strokeDashoffset = "150";
meter3.style.strokeDashoffset = "150";
