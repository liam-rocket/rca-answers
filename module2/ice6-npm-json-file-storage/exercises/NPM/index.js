// const { chef } = require("talk-like-a");
import { chef } from 'talk-like-a'; // if you have "type": "module" inside your package.json, then you will have to use "import"

const sentence = process.argv[2];
console.log(chef(sentence));
