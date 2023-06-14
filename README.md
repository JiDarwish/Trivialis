# Marku webapp
This is the webapp our clients will interact with when using marku (currently hosted [here](https://marku.trivial.group/)

# Deployment
This repository is setup to deploy whenever you push to branch `main`. So <span style="color: red;">make sure whatever you push builds</span>.

## Running locally
To run locally follow the following steps

First, copy `.env.example` to `.env` and fill in the required fields for running the application locally.

**Important**: For running locally you need to generate oauth tokens for both reddit and github (or
either if you don't want the hassle)

Second, run the following commands in your terminal.
```
# Install the packages
npm install 

# Run the application in development mode
npm run dev
```
Now you should have a running local app. For questions you can contact [Ji](mailto:ji.darwish98@gmail.com)

