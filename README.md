### Note:

- The application is using Node version `16.13.1` and NPM version `8.1.2`

### Configuration steps for client folder

- `cd` to client folder
- Install dependency with `npm -i`
- Run `npm run patch-package` for geting all changes in packages
- Start webpack server with `npm run dev` command



### How to generate JWT_SECRETE_KEY

- Execute this code in command line `node -e "console.log(require('crypto').randomBytes(32).toString('base64'));"`
- Paste the output as value in .env key `JWT_SECRET_KEY`

### Configuration steps for server folder

- In new command line `cd` to server folder and execute `npm -i`
- To start server execute code `npm run dev`
- Navigate to `localhost:9000` in browser
