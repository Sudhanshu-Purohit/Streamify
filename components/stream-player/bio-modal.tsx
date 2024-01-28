"use client";

import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState, useTransition, useRef, ElementRef } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { updateUser } from "@/actions/user";


interface BioModalProps {
    initialValue: string | null;
};

export const BioModal = ({
    initialValue
}: BioModalProps) => {

    const [value, setValue] = useState(initialValue || "");
    const [isPending, startTransition] = useTransition();
    const closeRef = useRef<ElementRef<"button">>(null);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(() => {
            updateUser({ bio: value })
                .then(() => {
                    toast.success("User bio updated");
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Something went wrong"))
        })
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="ml-auto">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit user bio
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Textarea 
                        placeholder="User bio"
                        onChange={(e) => setValue(e.target.value)}
                        value = {value}
                        disabled = {isPending}
                        className="resize-none"
                    />
                    <div className="flex justify-between">
                        <DialogClose ref={closeRef} asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button 
                            disabled = {isPending}
                            type="submit" 
                            variant="primary"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};