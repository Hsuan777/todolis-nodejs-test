const http = require('http');
const { v4: uuidv4 } = require('uuid');
const successHandle = require('./successHandle');
const errorHandle = require('./errorHandle');
const toDos = [];

const requestListener = (req, res) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requestd-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  };
  let body = '';
  req.on('data', (chunk) => body += chunk);

  if (req.url === '/todos' && req.method === 'GET') {
    successHandle(res, toDos);
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const toDoTitle = JSON.parse(body).title;
        if (toDoTitle !== undefined) {
          const toDo = {
            title: toDoTitle,
            id: uuidv4(),
          }
          toDos.push(toDo);
          successHandle(res, '新增資料成功');
        } else {
          errorHandle(res, '欄位名稱錯誤');
        }
      }catch {
        errorHandle(res, '新增資料失敗');
      }
    })
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    toDos.length = 0;
    successHandle(res, '全部資料刪除成功');
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    try {
      const id = req.url.split('/').pop();
      const toDoIndex = toDos.findIndex((item) => item.id === id);
      if (toDoIndex !== -1) {
        toDos.splice(toDoIndex, 1);
        successHandle(res, '刪除資料成功');
      } else {
        errorHandle(res, '無此 ID');
      }
    }catch {
      errorHandle(res, '刪除資料失敗');
    }
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try{
        const toDoTitle = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const toDoIndex = toDos.findIndex((item) => item.id === id);
        if (toDoIndex !== -1 && toDoTitle !== undefined) {
          toDos[toDoIndex].title = toDoTitle;
          successHandle(res, '編輯資料成功');
        } else {
          errorHandle(res, '欄位名稱錯誤或無此 ID');
        }
      }catch {
        errorHandle(res, '編輯資料失敗');
      }
    })
  } else if (req.url === '/todos' && req.method === 'OPTIONS') {
    successHandle(res, 'OPTIONS');
  } else {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'false',
      data: '無此頁面',
    }));
    res.end();
  }
}

http.createServer(requestListener).listen(process.env.PORT || 3000);