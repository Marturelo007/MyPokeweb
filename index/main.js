document.addEventListener('DOMContentLoaded', function(){

    var img = document.getElementById('myImage');
  
    img.addEventListener('mouseenter', function (){
      img.src = "../assets/FullPokeball.png";
    });
    
    img.addEventListener('mouseleave', function() {
      img.src = "../assets/EmptyPokeball.png"
    });
  
  });