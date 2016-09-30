var collide = function(obj1, obj2){
	if (obj1.position.x<obj2.position.x+118 && obj1.position.x>obj2.position.x && obj1.position.y<obj2.position.y && obj1.position.y>obj2.position.y-49){
		return true
	}else
		return false
}