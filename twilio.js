const accountSid = 'AC177c3d81bae1769ca8b2f4aaae545507';
const authToken = 'b0df1a6260bc4fa4a71185f579fdcdb3';
const client = require('twilio')(accountSid, authToken);

client.messages.create({
  body: 'hello usama',
  from: '+17035962791',
  to: '+923416773870',
});

// SK0217f3b333e9bfec7c3c5ca5f84d95f8

// 60PEWT4rpxVbwld0ebKwQ7KuVkxNiX2V
