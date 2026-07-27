import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "proj-mgt" });

//Inngest function to save user data to database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created' },
    async ({ event })=>{
        const {data} = event
        await prisma.user.create({
            data: {
                id: data.id,
                email: data?.email_addresses[0]?.email_address, //? mens like vo data ke side me ? hai toh uska matlab if data is there we will find the email addresses 
                name: data?.first_name + " " + data?.last_name, //? means if data is there?
                image: data?.image_url,


            }
        })
    }
)

//Inngest function to delete user from database\
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-from-clerk'},
    {event: 'clerk/user.deleted' },
    async ({ event })=>{
        const {data} = event
        await prisma.user.delete({
            data: {
                where: {
                    id: data.id,     

                }
            }
        })
    }
)

//Inngest function to update user data frrom database
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated' },
    async ({ event })=>{
        const {data} = event
        await prisma.user.update({
            where: {  //this where will choose the data to be updated
                id: data.id    // //here data means - "What values should I insert/update?"
            },
            data: {
                email: data?.email_addresses[0]?.email_address, //? mens like vo data ke side me ? hai toh uska matlab if data is there we will find the email addresses 
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,


            }
        })
    }
) 

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation
];