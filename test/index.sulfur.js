const Sulfur = require('./sulfur.min.js');
const url = "http://localhost:3000";


const sulfur = new Sulfur({
    title: "Urchin API",
    version: "1.0.0",
    desc: "a boilerplat engine for building swift backend apps"
});

require('../sulfurs/users.sc.js')(sulfur, url);

sulfur.run();