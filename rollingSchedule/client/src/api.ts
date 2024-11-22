
export const get = async (path:string)=>{
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
    }

}

export const post = async (path:string, data:any)=>{
    try{
        const response = await fetch(`/${path}`,{
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }
    catch(err){
        console.error("failed to fetch",err);
    }
}
