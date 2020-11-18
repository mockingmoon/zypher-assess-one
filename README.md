# zypher-assess-one
Please go to routes/zypher.js for the API endpoints

For finding the total reading duration for given user, the path is 
localhost:3000/zypher/read-time-user/:userId

For finding the total number of users who have read one book, the path is 
localhost:3000/zypher/total-users/:bookId

For finding the total time read by all users for one day, the path is 
localhost:3000/zypher/total-reading-forday/:date
E.g. localhost:3000/zypher/total-reading-forday/2020-11-19

(NOTE: I have assumed that a user can read only one book at a time. If a user starts reading a book, they must stop reading that book before starting the next book. Thus, for every user, there must an "end" log after every "start" log.)
