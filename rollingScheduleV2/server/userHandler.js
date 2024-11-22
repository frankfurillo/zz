import { encryptPassword } from "./encryption.js";
import { Repository } from './Repository.js';
const repository = new Repository();

const isnull = (obj) => {
    if (obj === undefined || obj === null) {
        return true;
    }
}
const checkLengthOk = (str, from, to) => {
    if (str.length <= from || str.length >= to) {
        return false
    }
    return true;
}

export const saveUser = async (user) => {
    if (!isnull(user)) {
        if (!checkLengthOk(user.username, 0, 50)) {
            throw new Error("username");
        }
        if (!checkLengthOk(user.password, 0, 50)) {
            throw new Error("pwd");
        }
    }
    user.password = await encryptPassword(user.password);;
    let userEntity = {
        _id: user.username,
        password: user.password
    }
    let id = await repository.saveObjToCollection(userEntity, "user");
    return id;
}

export const loginUser = async (user) => {
    if (!isnull(user)) {
        if (!checkLengthOk(user.username, 0, 50)) {
            throw new Error("username");
        }
        if (!checkLengthOk(user.password, 0, 50)) {
            throw new Error("pwd");
        }
    }
    let q = {
        username: user.username
    }
    var dbUser = await repository.findObj(user, q);

    return id;
}