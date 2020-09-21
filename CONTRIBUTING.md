# Contributing

Before adding new features or making major changes, please open an issue or contact me at [git@jottocraft.com](mailto:git@jottocraft.com).

## Documentation

You can read the Power+ docs at [powerplus.app/docs](https://powerplus.app/docs). 

## Code Organization

- `/scripts` Power+ script files
- `/scripts/lms` LMS integration files
- `/www` Static website files
- `/docs` JSDoc configuration
- `/chrome` Chrome extension source
- `/build` Public website and optimized JavaScript files generated by `npm run build`

## Development Environment

To get Power+ up and running locally, you'll need git and node installed on your system. When the server is ready, open Power+ and go to Settings -> About -> Show Advanced Options -> Load from localhost and type in the port the server is running on (the default is 2750).

```bash
git clone https://github.com/jottocraft/dtps.git dtps
cd dtps
npm install
npm start
```

## NPM scripts