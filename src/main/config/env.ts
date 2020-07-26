export default {
	port: process.env.PORT || 5050,
	jwtSecret: process.env.JWT_SECRET || 'tj670==5H',
	mongoUrl: process.env.MONGO_URL || 'mongodb://root:root@127.0.0.1:27017/admin'
}
