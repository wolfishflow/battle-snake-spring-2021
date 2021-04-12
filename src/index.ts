const express = require('express')

const app = express();
const port = 3000;
app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
  res.send('The sedulous ugh hyena ate the antelope!');
});
app.listen(port, (err: any) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});