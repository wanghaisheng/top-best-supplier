import { connectDB } from '../utils/mongodb'

export async function getSortedPostsData() {
    try {
        const db = await connectDB();
        const posts = await db
            .collection("level-1")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();

        const serializedAllPostsData = posts.map((post) => {
            post._id = String(post._id);
            return post;
        });

        return serializedAllPostsData;
    } catch (e) {

        return []; // Return an empty array or handle the error appropriately
    }
}



export async function getAllPostIds() {
    const db = await connectDB();
    const posts = await db
        .collection("level-1")
        .find({})
        .sort({ metacritic: -1 })
        .limit(10)
        .toArray();

    const serializedAllPostsData = posts.map((post) => {
        post._id = String(post._id);
        return post;
    });

    return serializedAllPostsData.map((post) => {
        return {
            params: {
                id: post.slug,
            },
        };
    });
}




export async function getPostData(id) {
    const client = await connectDB();
    const db = client.db('topingnow');
    const post = await db.collection('level-1').findOne({ slug: id });


    // Check if post is not null
    if (!post) {
        return {
            post: null
        };
    }

    // Serialize the post object to JSON serializable format
    const serializedPost = {
        _id: post._id.toString(),
        title: post.title,
    };

    return {
        post: serializedPost
    };
}