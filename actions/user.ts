"use server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateUser = async (values: Partial<User>) => {
    try {
        const self = await getSelf();

        const validData = {
            bio: values.bio
        };

        const user = await db.user.update({
            where: {id: self.id},
            data: {...validData}
        });

        revalidatePath(`/${self.username}`);
        revalidatePath(`/u/${self.username}`);

        return user;
    } catch (error) {
        throw new Error("Internal Error");
    }
}