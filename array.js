Array.prototype.getUnique = function(){
    var o = {}, a = [], i, e;
    for(i = 0; e = this[i]; i++){o[e] = 1};
    for(e in o) {a.push (e)};
    return a;
}

Array.prototype.inArray = function(val){
    for (var key in this){
        if(this[key] == val)
        {
            return true;
        }
    };
    return false;
}