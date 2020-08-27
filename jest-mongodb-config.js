module.exports = {
  // jest-mongodb automatically set `process.env.MONGO_URL`
  // https://github.com/shelfio/jest-mongodb#3-configure-mongodb-client
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.4.0',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};
