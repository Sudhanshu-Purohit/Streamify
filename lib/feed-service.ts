import { getSelf } from "./auth-service";
import { db } from "./db";

export const getStreams = async () => {
    let userId;

    try {
        const self = await getSelf();
        userId = self.id;
    } catch (error) {
        userId = null;
    }

    let streams = [];

    if (userId) {
        // load streams by user id
        streams = await db.stream.findMany({
            where: {
                user: {
                    NOT: {
                        blocking: {
                            some: {
                                blockedId: userId
                            }
                        }
                    }
                }
            },
            select: {
                id: true,
                user: true,
                isLive: true,
                name: true,
                thumbnailUrl: true
            },
            orderBy: [
                {
                    isLive: "desc"
                },
                {
                    updatedAt: "desc"
                }
            ]
        })
    } else {
        streams = await db.stream.findMany({
            select: {
                id: true,
                user: true,
                isLive: true,
                name: true,
                thumbnailUrl: true
            },
            orderBy: [
                {
                    isLive: "desc"
                },
                {
                    updatedAt: "desc"
                }
            ]
        })
    }

    return streams;
};