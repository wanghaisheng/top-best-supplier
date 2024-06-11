import { connectDB } from '@/app/utils/mongodb'
import { ObjectId } from 'mongodb';
import { beforeInsert, dataProcess, processInner } from '@/app/utils/custom_helpers';
import { isNull } from '@/app/utils/custom_helpers';

export async function getTops(page = 1, perPage = 10, essentials = 'yes', q = '', process = 'yes') {
    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();

        let filter = {};

        if (!isNull(q)) {
            filter = { title: { $regex: new RegExp(q, 'i') } }
        } else {
            filter = {};
        }

        let [result, total] = await Promise.all([
            db.collection("tops").find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .toArray(),

            db.collection("tops")
                .estimatedDocumentCount(filter)
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;

        if (isNull(result)) {
            return "not_found";
        }

        if (essentials == 'yes') {
            for (let i = 0; i < result.length; i++) {
                result[i].topTopics = await getTopics(String(result[i]._id), 1, 10, "no", "yes", '', {});
            }
        }

        if (process === 'yes') {
            for (let i = 0; i < result.length; i++) {
                result[i] = await dataProcess(result[i]);
            }
        }



        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 84775yyf" }

    }
}


export async function getTopsByImport(importId, page = 1, perPage = 10, q = '') {
    const skip = (page - 1) * perPage;



    try {
        const db = await connectDB();
        let filter = { importId: importId };

        if (!isNull(q)) {
            filter = { title: { $regex: new RegExp(q, 'i') } }
        } else {
            filter = {};
        }

        let [result, total] = await Promise.all([
            db.collection("tops").find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .toArray(),

            db.collection("tops")
                .estimatedDocumentCount(filter)
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;

        if (isNull(result)) {
            return "not_found";
        }

        const topTopicsPromises = result.map(async (data) => {
            const tTopics = await getTopics(String(data._id), 1, 10);
            return {
                ...data,
                topTopics: tTopics
            };
        });

        result = await Promise.all(topTopicsPromises);


        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 847ryr57" }

    }
}


export async function getListsByImport(importId, page = 1, perPage = 10, q = '') {
    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();
        let filter = { importId: importId };

        if (!isNull(q)) {
            filter = { title: { $regex: new RegExp(q, 'i') } }
        } else {
            filter = {};
        }

        let [result, total] = await Promise.all([
            db.collection("lists").find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .toArray(),

            db.collection("lists")
                .estimatedDocumentCount(filter)
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;

        if (isNull(result)) {
            return "not_found";
        }

        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: kjfhfur77" }

    }
}


export async function getTopicsByImport(importId, page = 1, perPage = 10, process = 'yes') {

    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();

        const filter = importId ? { importId } : {};

        const [result, total] = await Promise.all([
            db.collection("topics").find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .toArray(),

            db.collection("topics")
                .estimatedDocumentCount(filter)
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;

        if (isNull(result)) {
            return "not_found";
        }


        if (process === 'yes') {
            const promise = await result.map(async (r, i) => {
                result[i] = await dataProcess(result[i]);
            })
            Promise.all(promise);
        }

        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };

    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 74yy4747" }

    }
}

export async function getTopics(topId, page = 1, perPage = 10, essentials = 'yes', process = 'yes', q, others = {}) {
    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();
        let filter = topId ? { topId } : {};

        if (!isNull(q)) {
            filter = { title: { $regex: new RegExp(q, 'i') } }
        }

        if (others.filter) {
            filter = others.filter;
        }

        let sortOptions = {};

        if (others.sort) {
            sortOptions = others.sort;
        } else {
            sortOptions = { createdAt: -1 };
        }

        const [result, total] = await Promise.all([
            db.collection("topics").find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(perPage)
                .toArray(),

            db.collection("topics").estimatedDocumentCount(filter)
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;

        if (isNull(result)) {
            return "not_found";
        }

        if (essentials == 'yes') {
            for (let i = 0; i < result.length; i++) {
                const tTop = await getTop(String(result[i].topId))
                result[i].topData = tTop;
            }
        }

        if (process === 'yes') {
            for (let i = 0; i < result.length; i++) {
                let proData = {};
                if (result[i].topData) {
                    proData = { top: result[i].topData.top }
                } else {
                    const tTop = await getTop(String(result[i].topId))
                    result[i].topData = tTop;
                    proData = { top: result[i].topData.top }
                }

                result[i] = await dataProcess(result[i], 'topic', proData);
            }
        }

        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                numPages,
                hasNextPage,
                hasPrevPage
            }
        };

    } catch (error) {
        console.error(error)
    }
}



export async function fetchImports(page = 1, perPage = 10) {



    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();

        const [result, total] = await Promise.all([
            db.collection("imports").find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .toArray(),
            db.collection("imports").estimatedDocumentCount()
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;



        if (isNull(result)) {
            return "not_found";
        }



        return {
            success: true,
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };

    } catch (error) {

        console.error("Error in fetchImports", error);
        return "not_found";

    }

}


export async function fetchFiles(page = 1, perPage = 10) {



    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();

        const [result, total] = await Promise.all([
            db.collection("files").find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .toArray(),
            db.collection("files").estimatedDocumentCount()
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;



        if (isNull(result)) {
            return "not_found";
        }



        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };

    } catch (error) {

        console.error("Error in fetchFiles", error);
        return "not_found";

    }

}

export async function fetchTemplates(page = 1, perPage = 10) {


    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();

        const [result, total] = await Promise.all([
            db.collection("templates").find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(perPage)
                .toArray(),
            db.collection("templates").estimatedDocumentCount()
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;



        if (isNull(result)) {
            return "not_found";
        }



        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };

    } catch (error) {
        console.error("Error in fetchTemplates", error);
        return "not_found";

    }

}


export async function fetchTemplate(templateId, rand = 'no') {



    try {
        const db = await connectDB();

        let temp = await db.collection("templates").findOne({
            title: templateId
        });

        if (!temp && isValidObjectId(templateId)) {
            temp = await db.collection("templates").findOne({
                _id: new ObjectId(templateId)
            });
        }

        if (!temp) {
            return "not_found";
        }

        return temp;

    } catch (error) {
        console.error("Error in getTemplate", error);
        return "not_found";
    }

}


export async function fetchAQandA(id, rand = 'no', process = 'yes') {


    try {
        const db = await connectDB();

        let temp = await db.collection("qandas").findOne({
            slug: id
        });

        if (!temp && isValidObjectId(id)) {
            temp = await db.collection("qandas").findOne({
                _id: new ObjectId(id)
            });
        }

        if (!temp) {
            return "not_found";
        }

        if (process === 'yes') {
            // console.error(temp)
            temp = processInner(temp, "qanda");

        }


        return temp;

    } catch (error) {
        console.error("Error in getQandA", error);
        return "not_found";
    }

}


export async function fetchQandAs(listId, page = 1, perPage = 10, process = 'yes') {


    listId = String(listId);

    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();

        const filter = listId ? { listId } : {};

        const [result, total] = await Promise.all([
            db.collection("qandas").find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(perPage))
                .toArray(),

            db.collection("qandas")
                .estimatedDocumentCount(filter)
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;

        if (isNull(result)) {
            return "not_found";
        }

        if (process === 'yes') {
            for (let i = 0; i < result.length; i++) {
                result[i] = await dataProcess(result[i]);
                result[i] = await processInner(result[i], "qanda");

            }
        }

        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };

    } catch (error) {

        console.error(error);
        return { success: false };

    }

}


export async function getLists(topicId, page = 1, perPage = 10, essentials = 'yes', process = 'yes') {

    try {
        const skip = (page - 1) * perPage;


        const db = await connectDB();

        const filter = topicId ? { topicId } : {};

        const [result, total] = await Promise.all([
            db.collection("lists").find(filter)
                .sort({ position: 1 })
                .skip(skip)
                .limit(parseInt(perPage))
                .toArray(),

            db.collection("lists")
                .estimatedDocumentCount(filter)
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;

        if (isNull(result)) {
            return "not_found";
        }



        if (essentials == 'yes') {
            const ids = result.map((t) => String(t.topicId));
            const topics = await Promise.all(ids.map((t) => getTopic(t, 'no', 1, 10, 'yes')));

            for (let i = 0; i < result.length; i++) {
                result[i].topicData = topics[i]
                result[i].postSlug = `${topics[i].slug}/${result[i].slug}`
            }
        }

        if (process === 'yes') {
            for (let i = 0; i < result.length; i++) {

                let proData = {};
                if (result[i].topicData) {
                    proData = { topic: result[i].topicData.title }
                } else {

                    const topics = await Promise.all(ids.map((t) => getTopic(t, 'no', 1, 10, 'yes')));

                    proData = { topic: topics[i].topicData.title }

                }

                result[i] = await dataProcess(result[i], 'list', proData);
            }
        }

        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                numPages,
                hasNextPage,
                hasPrevPage
            }
        };
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 847746" }

    }
}

export async function getList(listId, essentials = 'yes', process = "yes") {

    try {
        const db = await connectDB();

        let topic = await db.collection("lists").findOne({
            slug: listId
        });

        if (!topic && isValidObjectId(listId)) {
            topic = await db.collection("lists").findOne({
                _id: new ObjectId(listId)
            });
        }

        if (!topic) {
            topic = await db.collection("lists").findOne({
                place_id: listId
            });
        }

        if (!topic) {
            return "not_found";
        }



        if (essentials == 'yes') {
            const tTop = await getTopic(String(topic.topicId), essentials, 1, 10, process)
            topic.topicData = tTop;
            const tQ = await fetchQandAs(topic._id, 1, 10, process)
            topic.qanda = tQ;
        }

        if (process === 'yes') {
            let proData = {};
            if (topic.topicData) {
                proData = { topic: topic.topicData.title }
            } else {
                const tTop = await getTopic(String(topic.topicId), "no", 1, 10, process)
                topic.topicData = tTop;
                proData = { topic: topic.topicData.title }
            }
            topic = await dataProcess(topic, 'list', proData);
        }

        return topic;

    } catch (error) {
        console.error("Error in getList", error);
        return "not_found";
    }

}


export async function getBusiness(id, essentials = 'yes', process = "yes") {

    try {
        const db = await connectDB();

        let topic = await db.collection("business").findOne({
            slug: id
        });

        if (!topic && isValidObjectId(id)) {
            topic = await db.collection("business").findOne({
                _id: new ObjectId(id)
            });
        }

        if (!topic) {
            return "not_found";
        }


        return topic;

    } catch (error) {
        console.error("Error in getBusiness", error);
        return "not_found";
    }

}


export async function getReviews(id, list_id = '', place_id = '', essentials = 'yes', page = 1, perPage = 10) {

    try {
        const db = await connectDB();


        if (list_id || place_id) {

            const skip = (page - 1) * perPage;

            const db = await connectDB();

            let filter = list_id ? { list_id } : {};

            let [result, total] = await Promise.all([
                db.collection("reviews").find(filter)
                    .sort({ published_at: -1 })
                    .skip(skip)
                    .limit(parseInt(perPage))
                    .toArray(),

                db.collection("reviews")
                    .estimatedDocumentCount(filter)
            ]);


            if (isNull(result)) {
                filter = place_id ? { place_id } : {};
                [result, total] = await Promise.all([
                    db.collection("reviews").find(filter)
                        .sort({ published_at: -1 })
                        .skip(skip)
                        .limit(parseInt(perPage))
                        .toArray(),

                    db.collection("reviews")
                        .estimatedDocumentCount(filter)
                ]);
            }

            const numPages = Math.ceil(total / perPage);
            const hasNextPage = page < numPages;
            const hasPrevPage = page > 1;



            if (isNull(result)) {
                return "not_found";
            }

            return {
                result: result,
                metadata: {
                    total,
                    page,
                    perPage,
                    hasNextPage,
                    hasPrevPage
                }
            };


        } else {
            let topic = await db.collection("reviews").findOne({
                review_id_hash: id
            });

            if (!topic && isValidObjectId(id)) {
                topic = await db.collection("reviews").findOne({
                    _id: new ObjectId(id)
                });
            }

            if (!topic) {
                return "not_found";
            }


            return topic;
        }
    } catch (error) {
        console.error("Error in getBusiness", error);
        return "not_found";
    }

}

export async function getPopularTopics(excludeId = '', page = 1, perPage = 10, process = 'yes') {

    const filter = excludeId ? { _id: { $ne: new ObjectId(excludeId) } } : {};

    const others = { filter, sort: { views: -1 } }

    const result = await getTopics("", 1, 10, "no", "yes", '', others);

    return result;
}


export async function getPopularLists(excludeId = '', essentials = '', page = 1, perPage = 10, process = 'yes') {
    const skip = (page - 1) * perPage;

    try {
        const db = await connectDB();

        const filter = excludeId ? { _id: { $ne: new ObjectId(excludeId) } } : {};

        const [result, total] = await Promise.all([
            db.collection("lists").find(filter)
                .sort({ views: -1 })
                .skip(skip)
                .limit(perPage)
                .toArray(),

            db.collection("lists")
                .estimatedDocumentCount(filter)
        ]);

        const numPages = Math.ceil(total / perPage);
        const hasNextPage = page < numPages;
        const hasPrevPage = page > 1;

        if (isNull(result)) {
            return "not_found";
        }

        if (process === 'yes') {
            const promise = await result.map(async (r, i) => {
                result[i] = await dataProcess(result[i]);
            })
            Promise.all(promise);
        }

        if (!isNull(result)) {
            const ids = result.map((t) => String(t.topicId));
            const topics = await Promise.all(ids.map((t) => getTopic(t, 'no', 1, 10, 'yes')));
            result.map((post, i) => {
                result[i].topicData = topics[i]
                result[i].postSlug = `${topics[i].slug}/${result[i].slug}`
            })
        }

        return {
            result: result,
            metadata: {
                total,
                page,
                perPage,
                hasNextPage,
                hasPrevPage
            }
        };

    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 847dhdh746" }

    }
}

export async function stat() {
    try {
        const db = await connectDB();
        const result = await db.collection.find().explain("executionStats");
        return result;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: dhdhgdg" }

    }

}


export async function getTopic(id, essentials = 'yes', page = 1, perPage = 10, process = 'yes',) {

    try {
        const db = await connectDB();

        let topic = await db.collection("topics").findOne({
            slug: id
        });

        if (!topic && isValidObjectId(id)) {
            topic = await db.collection("topics").findOne({
                _id: new ObjectId(id)
            });
        }

        if (!topic) {
            return "not_found";
        }

        if (essentials == 'yes') {
            const tTop = await getTop(String(topic.topId))
            topic.topData = tTop;
            //console.log(tTop.top)
            const per_page = tTop.top

            const tLists = await getLists(String(topic._id), 1, per_page, "yes", "yes")
            topic.lists = tLists;
        }


        if (process === 'yes') {
            let proData = {};
            if (topic.topData) {
                proData = { top: topic.topData.top }
            } else {
                const tTop = await getTop(String(topic.topId))
                topic.topData = tTop;
                proData = { top: topic.topData.top }
            }
            topic = await dataProcess(topic, 'topic', proData);
        }

        return topic;

    } catch (error) {
        console.error("Error in getTopic", error);
        return "not_found";
    }


}


export async function getTop(id, process = 'yes') {



    try {
        const db = await connectDB();

        let topic = await db.collection("tops").findOne({
            slug: id
        });

        if (!topic && isValidObjectId(id)) {
            topic = await db.collection("tops").findOne({
                _id: new ObjectId(id)
            });
        }

        if (isNull(topic)) {
            return "not_found";
        }

        if (process === 'yes') {
            await dataProcess(topic)
        }

        return topic;

    } catch (error) {
        console.error("Error in getTop", error);
        return "not_found";
    }

}


export async function getUser(uid) {
    try {
        const db = await connectDB();
        const user = await db
            .collection("users")
            .findOne({ uid: uid })
        return user;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 847dhdhdh746" }

    }
}


//POST

export async function addTopic(data) {

    try {
        const db = await connectDB();
        await db.collection("topics").insertOne(data);
        return _id;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 847uuryry746" }

    }
}



export async function addTemplate(data) {

    try {
        const db = await connectDB();

        const result = await db.collection("templates").insertMany(data);

        return result.insertedIds;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: kjfjf" }

    }
}


export async function addQandAs(data) {

    try {
        const db = await connectDB();

        const result = await db.collection("qandas").insertMany(data);


        if (result.insertedCount > 0) {
            return { success: true, ids: result.insertedIds, msg: `${result.insertedCount} data inserted` };
        } else {
            return { success: false, ids: result.insertedIds, msg: `no data added` };
        }
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 84jdjjd7746" }

    }
}

export async function addFiles(data) {

    try {
        const db = await connectDB();

        const result = await db.collection("files").insertMany(data);

        return result.insertedIds;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: jjjjfhdkj" }

    }
}


export async function addTops(data) {

    try {
        const db = await connectDB();

        const result = await db.collection("tops").insertMany(data);

        if (result.insertedCount > 0) {
            return { success: true, ids: result.insertedIds, msg: `${result.insertedCount} inserted` };
        } else {
            return { success: false, ids: result.insertedIds, msg: `no data inserted` };
        }
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 84hdue747746" }

    }
}



export async function addTopics(data) {
    try {
        const db = await connectDB();

        const result = await db.collection("topics").insertMany(data);


        if (result.insertedCount > 0) {
            return { success: true, ids: result.insertedIds, msg: `${result.insertedCount} data inserted` };
        } else {
            return { success: false, ids: result.insertedIds, msg: `no data added` };
        }

    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 88ur747746" }

    }
}



export async function addReviews(data) {
    try {
        const db = await connectDB();

        for (let i = 0; i < data.length; i++) {
            data[i] = beforeInsert(data[i])
        }

        const result = await db.collection("reviews").insertMany(data);

        if (result.insertedCount > 0) {
            return { success: true, ids: result.insertedIds, msg: `${result.insertedCount} data inserted` };
        } else {
            return { success: false, ids: result.insertedIds, msg: `no data added` };
        }

    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 8ue374j746" }

    }
}

export async function addLists(data, type) {

    try {
        const db = await connectDB();

        let result = {};

        if (type == 'gmap') {
            result = await db.collection("lists").insertMany(data);
        } else {
            result = await db.collection("lists").insertMany(data);
        }


        if (result.insertedCount > 0) {
            return { success: true, ids: result.insertedIds, msg: `${result.insertedCount} data inserted` };
        } else {
            return { success: false, ids: result.insertedIds, msg: `no data added` };
        }

    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 48rhhrhf" }

    }
}


export async function addBusiness(data) {

    try {
        const db = await connectDB();

        const result = await db.collection("business").insertMany(data);

        if (result.insertedCount > 0) {
            return { success: true, ids: result.insertedIds, msg: `${result.insertedCount} data inserted` };
        } else {
            return { success: false, ids: result.insertedIds, msg: `no data added` };
        }

    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 4ygeghhrhf" }

    }
}

export async function updateATopic(id, data) {

    const _id = new ObjectId(id);
    try {
        const db = await connectDB();
        await db.collection("topics")
            .updateOne({ _id: _id }, { $set: data });
        return { success: true };
    } catch (error) {
        console.error("Error updating topic", error);
        return { success: false };
    }
}


export async function updateATemplate(id, data) {


    const _id = new ObjectId(id);
    try {
        const db = await connectDB();

        await db.collection("templates")
            .updateOne({ _id: _id }, { $set: data });

        return true;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 847hhrfbcb" }

    }
}

export async function updateAQandA(id, data) {

    const _id = new ObjectId(id);
    try {
        const db = await connectDB();

        await db.collection("qandas")
            .updateOne({ _id: _id }, { $set: data });

        return true;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 877565hf" }

    }
}


export async function updateAList(id, data) {

    try {

        let objId = "";

        if (isValidObjectId(id)) {
            objId = new ObjectId(String(id))
        }

        const db = await connectDB();
        const result = await db.collection("lists").updateOne(
            { $or: [{ _id: objId }, { slug: id }] },
            { $set: data }
        );
        return { success: true, data: result, msg: "success" };
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error" }
    }
}

export async function updateATop(id, data) {

    const _id = new ObjectId(id);
    try {
        const db = await connectDB();

        await db.collection("tops")
            .updateOne({ _id: _id }, { $set: data });

        return true;

    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: hfhfgfr" }

    }
}



export async function addImport(data) {
    const _id = new ObjectId();
    data._id = _id;
    try {
        const db = await connectDB();
        await db.collection("imports").insertOne(data);
        return _id;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 0484857" }

    }
}

//DELETE

export async function removeTopics(id, topId, importId) {


    try {
        const db = await connectDB();

        let result;
        const _id = new ObjectId(id);

        if (importId) {
            const res = await getTopicsByImport(importId, 1, 1000000, 'no');
            if (!isNull(res.result) && Array.isArray(res.result)) {
                const ids = res.result.map((t) => String(t._id));
                const delLists = await Promise.all(ids.map((t) => removeList(null, t, null)));
            }

            result = await db.collection("topics").deleteMany({ importId: importId });
        }

        if (topId) {
            const res = await getTopics(topId, 1, 1000000, 'no');
            if (!isNull(res.result)) {
                const ids = res.result.map((t) => String(t._id));
                const delLists = await Promise.all(ids.map((t) => removeList(null, t, null)));
            }
            result = await db.collection("topics").deleteMany({ topId: topId });
        }

        if (id && isValidObjectId(_id)) {
            result = await db.collection("topics").deleteMany({ _id: _id });
            await removeList(null, id, null);
        }

        if (result.deletedCount > 0) {
            return { success: true, msg: `successfully deleted`, data: result };
        } else {
            return { success: false, msg: `unknown error`, data: result };
        }

    } catch (error) {
        console.error('Error removing topics:', error);
        return { success: false, msg: `${error}`, data: {} };
    }

}



export async function removeList(id, topicId, importId) {

    try {
        const db = await connectDB();

        let result;

        try {
            if (importId) {
                result = await db.collection("lists").deleteMany({ importId: importId });
                const res = await getListsByImport(importId, 1, 1000000, '');

                if (!isNull(res.result)) {
                    const ids = res.result.map((t) => String(t._id));
                    const delLists = await Promise.all(ids.map((t) => removeQandA(t, null, null)));
                }

            }

            if (topicId) {
                result = await db.collection("lists").deleteMany({ topicId: topicId });
            }

            if (id && isValidObjectId(id)) {
                result = await db.collection("lists").deleteMany({ _id: new ObjectId(id) });
                await removeQandA(null, null, id)
            }


        } catch (error) {
            console.error('Error removing lists:', error);
            return 0;
        }

        return result.deletedCount;
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 948jhrhf" }

    }
}




export async function removeQandA(id, importId, listId) {

    try {
        const db = await connectDB();

        let result;

        try {
            if (importId) {
                result = await db.collection("qandas").deleteMany({ importId: importId });

            }

            if (listId) {
                result = await db.collection("qandas").deleteMany({ listId: listId });

            }

            if (id && isValidObjectId(id)) {

                result = await db.collection("qandas").deleteMany({ _id: new ObjectId(id) });
            }


        } catch (error) {
            console.error('Error removing lists:', error);
            return 0;
        }

        return { success: true, count: result.deletedCount };
    } catch (error) {
        console.error(error)
        return { success: false, msg: "error: 848ryg757" }

    }
}



export async function removeTop(id, importId) {

    try {
        const db = await connectDB();

        let result = 0;
        let result2 = 0;

        try {
            if (id) {
                result = await db.collection("tops").deleteOne({ _id: new ObjectId(id) });
                await removeTopics(null, id, null);
            }

            if (importId) {
                const res = await getTopsByImport(importId, 1, 1000000, 'yes', '');

                if (!isNull(res.result)) {
                    const ids = res.result.map((t) => String(t._id));
                    const delLists = await Promise.all(ids.map((t) => removeTopics(null, t, null)));
                }
                result = await db.collection("tops").deleteMany({ importId: importId });
            }

            return { success: true, msg: "top removed" }

        } catch (e) {
            console.error(`${e} error 88364575`)
            return { success: false, msg: `${e}` }
        }
    } catch (error) {
        console.error(error)
        return { success: false, msg: String(error) }

    }
}


export async function removeImport(importId) {

    try {
        const db = await connectDB();

        const filter = {
            _id: new ObjectId(importId)
        };


        await removeTop(null, importId);
        await removeList(null, null, importId);
        await removeTopics(null, null, importId);

        const result = await db.collection("imports").deleteMany(filter);

        if (result.deletedCount > 0) {
            return { success: true, msg: `successfully deleted`, data: result };
        } else {
            return { success: false, msg: `unknown error`, data: result };
        }

    } catch (error) {
        console.error('Error removing import:', error);
        return { success: false, msg: `${error}`, data: {} };
    }

}

function isValidObjectId(id) {
    return ObjectId.isValid(id);
}