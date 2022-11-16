// TODO 1 ### Initialize
// * npm init -y
// * npx eslint --init
// * npm i express dotenv morgan
// ! Если "morgan" установить в "devDependencies" (с флагом "-D"), то будет ругаться "eslint"
// * npm i -D nodemon
// * npm i express-session session-file-store bcrypt
// * npx create-gitignore node
// ! В файл ".gitignore" добавить игнорирование папки "sessions"
// # sessions
// sessions
// ! В файле "package.json" добавить код:
// "start": "node src/index.js",
// "dev": "nodemon src/index.js --ignore sessions --ext js,jsx" // * Игнорирование "sessions", чтобы сервер лишний раз не перезагружался
// ! Установка "WebSocket"
// * npm i ws

// TODO 2 ### Install React(SSR) & Babel
// * npm i @babel/core @babel/preset-env @babel/preset-react @babel/register react react-dom
// !  Создать файл ".babelrc" (в корне) и добавить в него код:
// {
//   "presets": [
//     "@babel/preset-env",
//     "@babel/preset-react"
//   ]
// }

// TODO 3 ### В корне создать файлы ".env" и ".env.example" следующего содержания:
// PORT=3000
// SESSION_SECRET=qwerty
// DB_URL=postgres://super_user:123@localhost:5432/solo_project

// TODO 4.1 ### Создать "src" папку для "бэка"
// TODO 4.2 ### В папке "src" создать главный файл приложения - "index.js"
// TODO 4.3 ### В папку "src" добавить папки "lib", "views", "routes", "controllers" и "middlewares"
// TODO 4.4 ### Создать папку "public" для "фронта"
// TODO 4.5 ### В папку "public" добавить папки "js", "styles" и "images"

// TODO 5 ### Create DB
