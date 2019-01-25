"use strict";
window.shout={
        subscribers : [],
        subscribe: function(message, callback){
             this.subscribers.push({ message: message, callback: callback});
        },
        shoutout: function(message){
        this.subscribers.filter(s=>s.message===message).forEach(
            s => s.callback()
        );
    }
};
