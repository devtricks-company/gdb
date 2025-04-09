export default () =>({
    enviroment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT!,10) || 5600,
    host: process.env.HOST || 'localhost',
    database:{
        uri: process.env.MONGODB_URI,
        
    }
})