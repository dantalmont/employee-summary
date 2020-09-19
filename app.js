const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const teamMembers = [];

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

async function TeamBuilder(){
    let teamHTML = "";
    let teamSize;
    let teamMember = [];

    await inquirer.prompt(
      {
        type: "number",
        name: "rosterCount",
        message: "How many team member's do you have? "
      }
    )
    .then((data) => {
        teamSize = data.rosterCount + 1;
    });  

    if (teamSize === 0) {
        console.log("You need tor hire people!")
        return;
    }

    for(i = 1; i < teamSize; i++){

        let name;
        let id;
        let role;
        let email;

        await inquirer.prompt([ 
            {
                type: "input",
                name: "name",
                message: `What is employee (${i})'s name?`
            },
            {
                type: "input",
                name: "id",
                message: `What is the employee (${i})'s id?`
            },
            {
                type: "input",
                name: "email",
                message: `What is the employee (${i})'s Email?`
            },
            {
                type: "list",
                name: "role",
                message: `what the employee (${i})'s title?`,
                choices: ["Engineer", "Intern", "Manager"]
            }
        ])

        .then((data) => {

            name = data.name;
            id = data.id;
            role = data.role;
            email = data.email;

        });

        switch (role){
            case "Manager":
                await inquirer.prompt([
                    {
                        type: "input",
                        message: "What is your Manager's Office Number?",
                        name: "officeNumber"
                    }
                ])
                .then((data) => {

                    const manager = new Manager(name, id, email, data.officeNumber);
                    teamMembers.push(manager);

                    teamMember = fs.readFileSync("templates/manager.html");

                });
                break;

      
            case "Intern":
                await inquirer.prompt([
                    {
                        type: "input",
                        name: "school",
                        message: "What school is your Intern attending?"
                    }
                ])
                .then((data) => {
                    const intern = new Intern(name, id, email, data.school);
                    teamMember = fs.readFileSync("templates/intern.html");
                    teamMembers.push(intern);
                });
                break;

            case "Engineer":
                await inquirer.prompt([
                    {
                        type: "input",
                        name: "github",
                        message: "What is your Engineer's GitHub?"
                    }
                ])
                .then((data) => {
                    const engineer = new Engineer(name, id, email, data.github);
                    teamMember = fs.readFileSync("templates/engineer.html");
                    teamMembers.push(engineer);
                });
                break;
        } 
    }

        const mainHTML = fs.readFileSync("templates/main.html");
        
        fs.writeFile("output/team.html", render(teamMembers), function(err) {

            if (err) {
            return console.log(err);
            }
        
            console.log("Success!");
        
        });
}


TeamBuilder();

  
