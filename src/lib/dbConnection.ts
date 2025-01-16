import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

const dbConnection = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Database is already connected !")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGOBD_URL || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected is successfully !")

    } catch (error) {
        console.error("Error in DB connection", error)
        process.exit(1)
    }
}

export default dbConnection;

