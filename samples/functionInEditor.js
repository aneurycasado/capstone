function(basicGun, enemies, detail, freeze,
speed, double, bomb, radius){
    
    
    basicGun = freeze(basicGun);
    
    enemies.forEach(function(enemy){
        
        if(enemy.tag = "Big monster" ){
            
            enemy = detail(enemy);
            
            if(enemy.weakness == "fire"){
                
                bomb.go(enemy);
            }
            
            basicGun.shoot(enemy)
        }
    })
}