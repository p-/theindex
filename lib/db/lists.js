import {deleteOne, findOne, getAll, insert, updateOne} from "./db"
import {randIcon} from "../icon"

export async function getLists() {
    const lists = await getAll("lists")
    lists.forEach(t => t.img = randIcon())
    return lists
}

export async function getList(_id) {
    return await findOne("lists", {_id})
}

export async function addList(owner, name, nsfw, description, columns, items) {
    if (!owner || !name) {
        throw "Adding list and no owner or name specified"
    }

    return await insert("lists", {
        owner,
        name,
        nsfw: nsfw || false,
        description: description || "",
        columns: columns || [],
        items: items || []
    })
}

export async function updateList(_id, {owner, name, nsfw, description, items}) {
    if (!_id) {
        throw "Updating list and no _id specified"
    }

    let data = {}
    if (owner) {
        data.owner = owner
    }
    if (name) {
        data.name = name
    }
    if (nsfw) {
        data.nsfw = nsfw
    }
    if (description) {
        data.description = description
    }
    if (items) {
        data.items = items
    }

    return await updateOne("lists", {_id}, data)
}

export async function deleteList(_id) {
    return await deleteOne("lists", {_id})
}