"use strict";


let videoElmts = document.getElementsByClassName("tiktokDiv");
let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
let nextButton = document.getElementById("next");
let urlData = [];

//Get the videos on load
sendGetRequest("/getTwoVideos")
.then((result) => {
  for (let i=0; i<2; i++) {
    addVideo(result[i].split('~>')[0], videoElmts[i], result[i].split('>^')[1]);
    urlData.push(result[i]);
  }
  
  // load the videos after the names are pasted in! 
  loadTheVideos();
})
.catch((err) => {
  console.log(err);
});


for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click", function() { 
    reloadVideo(videoElmts[i]);
  });
  heartButtons[i].classList.add("unloved");
  heartButtons[i].id = i;
} 


//Add functionality for each heart button
heartButtons.forEach(heart => {
  heart.addEventListener("click", () => {

  //Unlove the other video if it is already loved
  if(heart.id == "0"){
    document.getElementById("1").className = "heart unloved";
    document.getElementById("1").firstChild.setAttribute("data-prefix", "far");
  } else {
    document.getElementById("0").className = "heart unloved";
    document.getElementById("0").firstChild.setAttribute("data-prefix", "far");
  }
    
  //Set clicked video to loved
  if (heart.className == "heart"){
    heart.className = "heart unloved";
    heart.firstChild.setAttribute("data-prefix", "far"); //Get child of heart 
  } else {
    heart.className = "heart loved";
    heart.firstChild.setAttribute("data-prefix", "fas"); 
  } 
  });
});

nextButton.addEventListener("click", () => {

  //User should not be able to click next if none of them are of class "heart"

  let hasSelected = false;
  let ratings = {};
  heartButtons.forEach(heart => {
    if(heart.className == "heart loved"){
      hasSelected = true;
      console.log(urlData);
      ratings.better = Number(urlData[heart.id].split('~>')[1].split('>^')[0]);
      ratings.worse = Number(urlData[Math.abs(~-heart.id)].split('~>')[1].split('>^')[0]); //BITWISE NOT
    } 
  });

  // console.log(ratings);

  //User must select before continuing
  if(!hasSelected){
    alert("Please select a video!"); 
  } else {
    /*Send post request to insert pref into database
    Set window location if max videos have been reached,
    Reload otherwise */
    sendPostRequest("/insertPref", ratings)
    .then((result) => {
      if(result == "Pick winner"){
        window.location = "winner.html";
      } else {
        window.location.reload();
      }
    })
    .catch((err) =>{
      console.log(err);
    });
  }
});
