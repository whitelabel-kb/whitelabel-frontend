/**
 * next-auth.functions.js Example
 *
 * This file defines functions NextAuth to look up, add and update users.
 *
 * It returns a Promise with the functions matching these signatures:
 *
 * {
 *   find: ({
 *     id,
 *     email,
 *     emailToken,
 *     provider,
 *     poviderToken
 *   } = {}) => {},
 *   update: (user) => {},
 *   insert: (user) => {},
 *   remove: (id) => {},
 *   serialize: (user) => {},
 *   deserialize: (id) => {}
 * }
 *
 * Each function returns Promise.resolve() - or Promise.reject() on error.
 *
 * This specific example supports both MongoDB and NeDB, but can be refactored
 * to work with any database.
 *
 * Environment variables for this example:
 *
 * MONGO_URI=mongodb://localhost:27017/my-database
 * EMAIL_FROM=username@gmail.com
 * EMAIL_SERVER=smtp.gmail.com
 * EMAIL_PORT=465
 * EMAIL_USERNAME=username@gmail.com
 * EMAIL_PASSWORD=p4ssw0rd
 *
 * If you wish, you can put these in a `.env` to seperate your environment
 * specific configuration from your code.
 **/

// Load environment variables from a .env file if one exists
require('dotenv').load()
module.exports = () => {
  return new Promise((resolve, reject) => {
    // call api auth
  })
  .then(usersCollection => {
    return Promise.resolve({
      // If a user is not found find() should return null (with no error).
      find: ({id, email, emailToken, provider} = {}) => {
        let query = {}

        // Find needs to support looking up a user by ID, Email, Email Token,
        // and Provider Name + Users ID for that Provider
        if (id) {
          query = { _id: id }
        } else if (email) {
          query = { email: email }
        } else if (emailToken) {
          query = { emailToken: emailToken }
        } else if (provider) {
          query = { [`${provider.name}.id`]: provider.id }
        }

        return new Promise((resolve, reject) => {
        //   usersCollection.findOne(query, (err, user) => {
        //     if (err) return reject(err)
        //     return resolve(user)
        //   })
        })
      },
      // The user parameter contains a basic user object to be added to the DB.
      // The oAuthProfile parameter is passed when signing in via oAuth.
      //
      // The optional oAuthProfile parameter contains all properties associated
      // with the users account on the oAuth service they are signing in with.
      //
      // You can use this to capture profile.avatar, profile.location, etc.
      insert: (user, oAuthProfile) => {
        return new Promise((resolve, reject) => {

        //   usersCollection.insert(user, (err, response) => {
        //     if (err) return reject(err)
        //     if (!user._id && response._id) user._id = response._id

        //     return resolve(user)
        //   })
        })
      },
      // The user parameter contains a basic user object to be added to the DB.
      // The oAuthProfile parameter is passed when signing in via oAuth.
      //
      // The optional oAuthProfile parameter contains all properties associated
      // with the users account on the oAuth service they are signing in with.
      //
      // You can use this to capture profile.avatar, profile.location, etc.
      update: (user, profile) => {
        return new Promise((resolve, reject) => {
          // update API
        //   usersCollection.update({_id: MongoObjectId(user._id)}, user, {}, (err) => {
        //     if (err) return reject(err)
        //     return resolve(user)
        //   })
        })
      },
      // The remove parameter is passed the ID of a user account to delete.
      //
      // This method is not used in the current version of next-auth but will
      // be in a future release, to provide an endpoint for account deletion.
      remove: (id) => {
        return new Promise((resolve, reject) => {
        //   usersCollection.remove({_id: MongoObjectId(id)}, (err) => {
        //     if (err) return reject(err)
        //     return resolve(true)
        //   })
        })
      },
      // Seralize turns the value of the ID key from a User object
      serialize: (user) => {
        // Supports serialization from Mongo Object *and* deserialize() object
        if (user.id) {
          // Handle responses from deserialize()
          return Promise.resolve(user.id)
        } else if (user._id) {
          // Handle responses from find(), insert(), update()
          return Promise.resolve(user._id)
        } else {
          return Promise.reject(new Error("Unable to serialise user"))
        }
      },
      // Deseralize turns a User ID into a normalized User object that is
      // exported to clients. It should not return private/sensitive fields,
      // only fields you want to expose via the user interface.
      deserialize: (id) => {
        return new Promise((resolve, reject) => {
        //   usersCollection.findOne({ _id: MongoObjectId(id) }, (err, user) => {
        //     if (err) return reject(err)
        //     if (!user) return resolve(null)

        //     return resolve({
        //       id: user._id,
        //       name: user.name,
        //       email: user.email,
        //       emailVerified: user.emailVerified,
        //       admin: user.admin || false
        //     })
        //   })
        })
      },
      // Define method for sending links for signing in over email.
      sendSignInEmail: ({
        email = null,
        url = null
        } = {}) => {

        if (process.env.NODE_ENV === 'development')  {
          console.log('Generated sign in link ' + url + ' for ' + email)
        }
      },
    })
  })
}