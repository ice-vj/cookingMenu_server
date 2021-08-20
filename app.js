const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const debug = require('debug')('demo:server');
const http = require('http');

const config = require('config');

function initMiddleware (app) {
	// error handler
	onerror(app)

	// middlewares
	app.use(bodyparser({
		enableTypes:['json', 'form', 'text']
	}))
	app.use(json())
	app.use(logger())
	app.use(require('koa-static')(__dirname + '/public'))

	app.use(views(__dirname + '/views', {
		extension: 'pug'
	}))

	// logger
	app.use(async (ctx, next) => {
		const start = new Date()
		await next()
		const ms = new Date() - start
		console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
	})
	
	const responseWrapper = require('./src/utils/response_wrapper');
    app.use(responseWrapper());

	//注册路由
	const router = require('./routes/index');
    app.use(router.routes());

	// error-handling
	app.on('error', (err, ctx) => {
		console.error('server error', err, ctx)
	});
}

function startServer (app) {
	
	/**
	 * Get port from environment and store in Express.
	 */

	let port = normalizePort(config.get('PORT') || '8080');
	// app.set('port', port);

	/**
	 * Create HTTP server.
	 */

	let server = http.createServer(app.callback());

	/**
	 * Listen on provided port, on all network interfaces.
	 */

	server.listen(port);
	console.log('Listening on :' + port);

	server.on('error', onError);
	server.on('listening', onListening);


	/**
	 * Normalize a port into a number, string, or false.
	 */

	function normalizePort(val) {
		let port = parseInt(val, 10);
	
		if (isNaN(port)) {
		// named pipe
		return val;
		}
	
		if (port >= 0) {
		// port number
		return port;
		}
	
		return false;
	}
	
	/**
	 * Event listener for HTTP server "error" event.
	 */
	
	function onError(error) {
		if (error.syscall !== 'listen') {
		throw error;
		}
	
		let bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;
	
		// handle specific listen errors with friendly messages
		switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
		}
	}
	
	/**
	 * Event listener for HTTP server "listening" event.
	 */
	
	function onListening() {
		let addr = server.address();
		let bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
		debug('Listening on ' + bind);
	}
}

// 数据库初始化
async function initMongoDb() {
	const mongodber = require('./src/utils/mongodber');
	let databases = config.get('MONGODBS');
    await mongodber.init(databases);
}

// 数据库初始化
async function initMySql(app) {
	const mysqler = require('./src/utils/mysqler');
	app.use(async (ctx, next) => {
		ctx.util = {
			mysql: mysqler.query
		}
		await next();
	})
}

(async function init() {
    // 初始化数据库连接
    await initMongoDb();
	// await initMySql(app)
    // 初始化中间件
    initMiddleware(app);
    // 启动服务
    await startServer(app);
})();