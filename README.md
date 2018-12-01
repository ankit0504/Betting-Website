This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



`create database betting;`

`use betting;`

```
CREATE TABLE users (
  username varchar(30) NOT NULL,
  password varchar(300) NOT NULL,
  PRIMARY KEY (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

```
CREATE TABLE bets (
  id mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  user1 varchar(30) NOT NULL,
  user2 varchar(30),
  title varchar(40) NOT NULL,
  description varchar(128) NOT NULL,
  open tinyint(1) NOT NULL,
  completed tinyint(1) NOT NULL,
  public tinyint(1) NOT NULL,
  category varchar(30) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

```
INSERT into bets(user1, user2, title, description, open, completed, public, category)
VALUES('user5', 'user1', 'bet5', 'description5', 0, 1, 1, 'sports');
```

 Commands to get to mysql:
 `cd ../../usr/local/mysql/bin`
 `./mysql -u root -p`
 Ankit's password: 19ankit99
 Kalli's password: Loopys13!

Need to run `cd front-end` `npm start` in one terminal window and `cd back-end` `node index.js` in another. Use the "On your network" URL
