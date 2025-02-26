## Assignment To-Do List Maker

## NEW README HERE

Render Link: https://a3-nnewt1.onrender.com

This project is a simple to-do list maker. The key differences from A2 are the use of MongoDB to store data associated with a user and the use of GitHub OAuth for user authentication.
I was able to get the GitHub OAuth to work, and I was able to get the MongoDB connection to work. I was able to create users in the database and store to-do list items associated with a user.
I faced many challenges earlier, but following the completion of A4 and having a special help session with Professor Wong, I was able to redo this assignment much better I believe.
I used GitHub OAuth because I had used it for A4 successfully. I used TailwindCSS since it seemed the most basic CSS framework I could use that wasn't tailored to React, which this project is not.

## Technical Achievements
- **Tech Achievement 1**: Used GitHub OAuth to sign in. Alexander Beck's passport-github-demo repository was a massive help in getting this to work.
- **Tech Achievement 2**: Used Render to host instead of Glitch. Like the interface and deployment process better with Render, and it seems to be better integrated with GitHub.

## Design/Evaluation Achievements
- N/A

## OLD README BELOW

Glitch Link http://a3-nnewt1.glitch.me

This project was intended to be a simple to-do list maker, similar to what I made for A2.
The key differences would have been a new login system, the use of MongoDB to store data associated with a user, and a new CSS framework for better appearance overall.
While it seems I was able to integrate with MongoDB, I was unable to get the login system to work. I tried for hours to get Passport Local Strategy to work but failed.
Since everything pertaining to the database relied on user authentication, I don't have anything to show for my connection to MongoDB either.
I had planned to use Mongoose as my library for MongoDB connections as I liked the schema definition framework it provided, and while I did get to see it in action, I didn't get to use it for everything I intended.
What I mean by this is that I was able to create users in the database (e.g. submit the registration on login.html and have the new user show up in MongoDB), but I was unable to ever login to a user after creating one, and the data that showed up in MongoDB was not comprehensible to any point where I could see if something was wrong.
I chose Material Tailwind as my CSS framework as it is what my group plans to use for the final project and I wanted to learn it.
Unfortunately I spent all my time struggling with the login system and was unable to get to the styling part of the project.
Pretty much all you will be able to do on my most recent commit is run the app with express and see the main page and login page.
Didn't get around to testing with Lighthouse or going for any achievements.

Professor Wong very kindly offered me a 24-hour extension (hence the late commit) to submit this assignment after I expressed to him yesterday that I was in a bad time crunch, but unfortunately even with all the time I put into the assignment today, I didn't get much done. I apologize.

## Technical Achievements
- **Tech Achievement 1**: I tried to use additional packages (as seen in package.json) to make my Express app work, but all to no avail.

## Design/Evaluation Achievements
- N/A
