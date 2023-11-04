document.querySelectorAll('.card').forEach(card=>{
    // cards initial position
    card.style.transform = 'rotateY(180deg)';
    card.style.transition = 'transform 0.5s';
    
    card.addEventListener('mouseover',function(){
        card.style.transform = 'rotateY(0deg)';
    })
    card.addEventListener('mousout',function(){
        card.style.transform = 'rotateY(180deg)';
    })
})