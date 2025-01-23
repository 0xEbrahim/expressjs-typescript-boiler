import {User} from "../models/userModel";
import {createEntity, deleteEntity, getAllEntity, getEntity, updateEntity} from "./factoryController";

export const createUser = createEntity(User)

export const deleteUser = deleteEntity(User)

export const getAllUsers = getAllEntity(User)

export const updateUser = updateEntity(User)

export const getUser = getEntity(User)
