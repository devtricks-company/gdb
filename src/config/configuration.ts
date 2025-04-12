export default () => ({
  enviroment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT!, 10) || 5600,
  host: process.env.HOST || 'localhost',
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  google: {
    clientID: process.env.CLIENTID || '',
    clientSecret: process.env.CLIENTSECRET || '',
    callbackURL: process.env.CALLBACKURL || '',
  },
  snapchat: {
    client_ID: process.env.SNAPCHAT_CLIENT_ID || '',
    client_secret: process.env.SNAPCHAT_CLIENT_SECRERT || '',
    callbackURL: process.env.SNAPCHAT_CALLBACK || '',
  },
});
