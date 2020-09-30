const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {

        // use the mongo drivers' updated url string parser
        mongoose.set('useNewUrlParser', true);
        //use findoneandupdate() in place of findand modify
        mongoose.set('useFindAndModify', false);
        // use createIndex() in place of ensureIndex()
        mongoose.set('useCreateIndex', true);
        //use the new server discovery and monitoring engine
        mongoose.set('useUnifiedTopology', true);
        //connect
        mongoose.connect(DB_HOST);
        //log error 
        mongoose.connection.on('consolo error',err => {
            console.error(err);
            console.log('Mongdb connection error. Make sure MonDb is runnin'
            );
            process.exit();
        
        });

    },
    close: () => {
        mongoose.connection.close();
    }
};