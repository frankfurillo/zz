import bcrypt from 'bcrypt';
const saltRounds = 10;


export const encryptPassword =  async (password)=>{
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })
    
      return hashedPassword
  
}

export const doesPasswordMatchHash = async (password, hashedPwdFromDb)=>{
// Compare a password with its hash
    const isOk = await new Promise((resolve,reject)=>{
        bcrypt.compare(password, hashedPwdFromDb, (err, result) => {
            if (err) reject (err);
            if (result) {
                resolve(true);
            // Passwords match
            } else {
                resolve(false);
            // Passwords do not match
            }
        });
    });
    return isOk;
}    


