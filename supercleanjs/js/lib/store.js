
    let state = {
        idiots : []
    };

    function updateState(stateProp,value){
        state[stateProp] = value;
    }
    function getState(stateProp){
        return state[stateProp];
    }

export default {updateState}; 