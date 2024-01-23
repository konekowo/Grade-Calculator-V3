# Grade Calculator V3

A full stack web-app made in Vanilla TypeScript that lets you calculate your final score and GPA with "what-if" grades that you put in without having to put in all of your previous grades.

#### If you would like to support this project, you can donate to my Buy Me A Coffee page here:
<a href="https://www.buymeacoffee.com/konekowo" target='_blank'><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=konekowo&button_colour=BD5FFF&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" /></a>

### How does Grade Calculator V3 retrieve grades from my school's grading portal?

The frontend sends your Student ID and Password to the backend server which requests data from your school's grade portal using the Student ID and Password, parses it, and then waits for the client to get the parsed data. Once 3 minutes (this is configurable by the server owner) has passed, the data is deleted from the server's memory, and cannot be retrieved again unless you make a new login request to the backend server.

### How do I add my own school district to this grade calculator?

Instructions on how to do this will be coming soon!

### How do I host Grade Calculator V3?
- This how-to is for beginners in Node.js.
- Also, at the time of writing this, macOS is not supported for hosting/developing Grade-Calculator-V3. Windows and Linux are supported.
1. Make sure you have git and Node.js 18 or above with NPM installed.
2. Clone this repository by opening a terminal and entering this in:
```
git clone https://github.com/konekowo/Grade-Calculator-V3.git
```
3. After that's done, go to the repository's directory in the terminal by entering this in:
```
cd Grade-Calculator-V3
```
4. Now you have to install the dependencies. To do this, enter in:
```
npm i
```
5. Wait until that command is done, then, enter this in:
```
cd frontend
npm i
```
6. Wait until that command is done, then, enter this in:
```
cd ..
cd backend
npm i
```
7. When that command is done, enter this in:
```
cd ..
```
- If you want to develop, skip steps 8-12.
8. Keep your terminal open, we will be using that later. Now, you need to edit the `config.json` file in the root of your repository.
9. Open `config.json` which is in the root of the repository with any text editor, such as, notepad.
10. Here, you can change the backend port, the backend's public server address, and the maximum number of requests the server can be working on at a time. These options have the names: `backendPort` for the backend server port, `backendLink` for the backend's public server address, `backendMaxActiveRequests` for the maximum number of requests that the backend server can be working on at a time.
11. Once you have made your changes, save and close the text editor, then go back to the terminal.
12. Enter this in to the terminal to start both the backend server and frontend server:
```
npm run start
```
- If you want to develop, you can start both the frontend and backend server in watch mode by entering in:
- <b>WARNING: before running the below command, run `npm run start` first, wait 5-30 minutes (depends on your internet) and make sure you see `Browser Installed!` in the termininal output. After that, then run the below command. (You only have to do this if you are running this for the first time)</b>
```
npm run dev
```
13. Now, wait a few minutes to let it build.
14. After you think it's done (wow!! you can read a terminal's output), open `localhost:8080` (or the frontend url you set in a reverse proxy beforehand) in a web browser to open the frontend.
15. Try logging in, if it works successfully (like the request goes through to the backend server, it doesn't matter if the password or student ID is wrong), You did it!

### Features
- If you want a new feature in this grade calculator, make an issue on this repository telling us what you think should be a feature! You are also more than welcome to add the feature yourself and make a pull request on this repository for it (you will get credit for it on this feature list if you do so).


- Backend
  - [X] Retrieving Grades from at least one grade portal
  - [X] Automatic Browser downloading
  - [ ] Multithreading
  - [X] Parsing of data returned by grade portal
  - [X] Ability to easily add new school districts later
  - [X] Login for all school districts takes less than 30 seconds
- Frontend
  - [X] Ability to log in
  - [X] Ability to calculate Quarter/Semester grades
  - [X] Ability to calculate GPA
  - [X] Ability to easily add new school districts later
  - [X] Ability to add new grades into a class (through just creating a new assignment object and putting it in edit mode)
  - [X] Ability to edit grades in a class
    - [X] Edit name
    - [X] Edit grade
    - [X] Edit due date
    - [X] Ability to calculate late score
      - [X] Change percent taken off per day/week/month
      - [X] Change frequency of when percent is taken off
      - [X] Ability to include Weekends when taking off percent
      - [X] Change the date of submission
      - [X] Ability to start taking off percent on the due date (this should be enabled if the assignment is due at a specific time, such as at the end of that class, and not at midnight, and also if the current time is after the due time, because the grade calculator doesn't support time, only dates)
  - [X] Ability to delete grades in a class