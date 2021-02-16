# Messaging App

// backend
// need logout function that removes cookie from local
// need reauth method call in useAuth that tries to reauth with cookie if there is one
// put better security on cookie

// frontend
// need to flesh out message component
// add api calls to all components, creation and read on login

container ->
left, right
A full-stack real time messaging application made using the MERN stack and using Socket.IO.

## Installing

To install this application locally, we need to create a .env file in the server directory with:

```bash
  DB_URI="Your MongoDB URI path"
  JWT_SECRET="A Secret of your choosing"
```

Once the .env file is created and filled use npm or yarn to install dependencies and run:

```bash
  yarn install
  yarn dev
```
