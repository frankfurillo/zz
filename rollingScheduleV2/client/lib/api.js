
export const get = async (path)=>{
    try{
        const response = await fetch(`/${path}`,{
            method : "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        return response.json();
    }
    catch(err){
        console.error("failed to fetch",err);
        throw new Error(err);
    }

}

export const post = async (path, data)=>{
    try{
        const res = await fetch(`/${path}`,{
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if(!res.ok) {
            return res.text().then(text => { 
                throw new Error(text) 
            })
           }
          else {
           return res.json();
         }    
    }
    catch(err){
        console.error("failed to fetch",err);
        throw new Error(err);
    }
}
