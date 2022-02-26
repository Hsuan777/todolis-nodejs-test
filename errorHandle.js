function successHandle(res, msg) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requestd-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  };
  res.writeHead(400, headers);
    res.write(JSON.stringify({
      status: 'false',
      data: msg,
    }));
    res.end();
}
module.exports = successHandle;