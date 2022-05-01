const { v1: uuidv1 } = require('uuid');
const { findMissingCredentials } = require('../../libs/libs');
const { getGalleryById } = require('../galleries/galleries.modal');

const Collection = require('./collections.mongo');

const addCollection = async (body, jwtGallery) => {
    const requiredFields = [
        'collection_name',
        'description',
        'image'
    ]
    
    const missingCredentials = findMissingCredentials(body, requiredFields)

    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }

    const doesCollectionExist = await doesCollectionExistByIdAndName(jwtGallery.gallery_id, body.collection_name)

    if(doesCollectionExist) {
        return([400, 'Collection already exists'])
    }

    const collection_id = uuidv1();
        
    const newCollection = new Collection({
        gallery_id: jwtGallery.gallery_id,
        collection_id: collection_id,
        collection_name: body.collection_name,
        description: body.description,
        image: body.image
    })   

    try {
        await newCollection.save()
        return ([201, 'Created'])
    } catch(err) {
        const errorFields = Object.keys(err.errors)
        return ([400, {typeError: errorFields}])
    }

}

const getCollectionsByGalleryId = async(gallery_id) => {
    const collections = await Collection.find({
        gallery_id: gallery_id
    }, {
        _id: 0, gallery_id: 0
    })
    if(!collections.length) {
        const gallery = await getGalleryById(gallery_id)

        if(gallery[0] === 400) {
            return ([400, 'Gallery id does not exist'])
        }
    }
    return ([200, collections])
}

const getCollectionById = async(collection_id) => {
    const collection = await Collection.findOne({
        collection_id: collection_id
    }, {
        _id: 0
    })
    
    if(!collection) {
        return ([400, 'There is no collection with this id'])
    }

    return ([200, collection])
}

const doesCollectionExistByIdAndName = async(gallery_id, collection_name) => {
    const response = await Collection.exists({gallery_id: gallery_id, collection_name: collection_name})
    return Boolean(response)
}

const doesCollectionExistByIds = async(gallery_id, collection_id) => {
    const response = await Collection.exists({gallery_id: gallery_id, collection_id: collection_id})
    return Boolean(response)
}

const doesCollectionExistById = async(collection_id) => {
    const response = await Collection.exists({collection_id: collection_id})
    return Boolean(response)
}

module.exports = {
    addCollection,
    getCollectionsByGalleryId,
    getCollectionById,
    doesCollectionExistByIds,
    doesCollectionExistById
}