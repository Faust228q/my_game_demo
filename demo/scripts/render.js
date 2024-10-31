// variables region


/**
 * @var {undefined | Object} __file_json
 * @description Contains a questions, categories and head of file with questions
 *
 * @default undefined
 */
let __file_json = undefined;


/**
 *
 * @var {[Object]} __teams
 * @description contains a name and points of all teams
 *
 * @default []
 */
let __teams = [];


/**
 *
 * @var {number} __teams_amount
 * @description contains a number of teams
 * @default 0
 * @private
 */
let __teams_amount = 0;


/**
 *
 * @var {Object} __current_team
 * @description contains a current team
 * @default {}
 *
 * @private
 */
let __current_team = {};

/**
 *
 * @var {number} __index_team
 * @description using for auto naming team when it is creating
 * @private
 * @default 0
 */
let __index_team = 0;

/**
 *
 * @var {number} __max_questions
 * @description max number of questions
 * @default 0
 * @private
 */
let __max_questions = 0;


/**
 *
 * @var {number} __questions_amount
 * @description number of questions answered
 * @default 0
 * @private
 */
let __questions_amount = 0;


//end region
/**
 *
 *
 * @function change_team
 * @description change a current team
 *
 *  @returns {void}
 *
 *
 */
function change_team() {
    if (__index_team >= __teams.length) { // if app try to address to element, that don`t contains in teams array, it turns into 0
        __index_team = 0;

    }
    __current_team = { // set a current team
        name: __teams[__index_team].name,
        number: __index_team
    };
    __index_team++; // incrementing an index of team
}

/**
 *
 *
 * @function load_team
 * @description update a widget #list-current-team and rewrite it text on current team`s name
 *
 * @returns {void}
 *
 *
 */
function load_team() {
    const text_node = document.createElement("p"); // text node that contains a name of current team
    text_node.innerText = __current_team.name; // set an inner text
    const parent = document.querySelector("#list-current-team"); // get a link on #list-current-team
    const child = parent.querySelector("p"); // get a link on child node of parent
    if (child) {
        parent.removeChild(child); // remove it
    }
    parent.appendChild(text_node); // append a new text node
}

/**
 *
 *
 * @function create_cats_widgets
 * @description create a widgets-categories in list of categories
 *
 *  @returns {void}
 *
 *
 */
function create_cats_widgets() {
    const __list = __file_json["data"];// list of categories

    /**
     * @description loop that creating a category each iteration
     */
    for (const element in __list) {
        const __el = __list[element]; // current category
        const body = document.createElement("div"); // body of category
        body.className = "list-cats-cat";

        const header = document.createElement("p") // name of category
        header.className = "list-cats-cat-name";
        header.innerHTML = element;

        body.appendChild(header);

        const list = document.createElement("div"); // list of questions
        list.className = "list-cats-cat-list";

        /**
         * @description loop that creating a question of current category each iteration
         */
        for (const question in __el) {
            const __question = __el[question]; // question, not index of it
            const button = document.createElement("button"); // question widget
            button.className = "list-cats-cat-list-question";
            button.addEventListener("click", async () => {
                /**
                 * @callback
                 * @async
                 * @description update a page after button wqs pressed
                 * @return {Promise<void>}
                 */
                button.disabled = true; // disable a pressed button
                await page_question(__question) // update page
            });
            button.innerHTML = __question["grade"]; // write points in button
            list.appendChild(button); // append question to category
            __max_questions++;
        }
        body.appendChild(list); // append a questions to category
        document.querySelector("#list-cats").appendChild(body); // append category to list
    }


}

/**
 *
 *
 * @function delete_team
 * @description delete team from the list
 *
 * @param {Element} widget - link on team widget
 *
 * @returns {void}
 *
 *
 */
function delete_team(widget) { // function that uses for deleting team from list
    const teams_list = document.getElementById("team-teams"); // parent for all teams
    teams_list.removeChild(widget);// remove the team

}

/**
 *
 *
 * @function return_team
 * @description create a team widget
 *
 *
 *
 * @returns {HTMLDivElement}
 */
function return_team() { // function that uses for creating a team

    const team_element = document.createElement("div"); // create body of team
    team_element.id = `team_${__teams_amount}`;
    team_element.className = "team-team";

    const input = document.createElement('input'); // create input field for name of team
    input.className = "team-team-name";
    input.value = `team${__teams_amount++}`;
    team_element.appendChild(input);

    const button = document.createElement("button"); // create a button for deleting the team
    button.className = "team-team-rem";
    button.addEventListener("click", () => delete_team(team_element));

    const img = document.createElement("img");// create image for button
    img.src = "../assets/images/svg/remove.svg";
    button.appendChild(img); // append image to button
    team_element.appendChild(button); // append button to team widget

    return team_element;
}


/**
 *
 *
 * @function add_team
 * @description adding a new team
 *
 * @async
 *
 *  @returns {Promise<void>}
 *
 *
 */
async function add_team() { // function that uses for appending a new team
    const container = document.getElementById('team-teams'); // parent for all team

    container.appendChild(await return_team()); // append team to list

}

// region load pages


/**
 *
 *
 * @function page_question
 * @description load on display a page that contains a question and field that used for writing answer
 *
 * @param {Object} obj - contains an information about question such as name and points
 *
 * @returns {Promise<void>}
 * @async
 */
async function page_question(obj) {


    const body = document.createElement("div"); // creating a body of new page
    body.id = "answer";

    const div = document.createElement("div"); // creating a widget that contains a question
    div.id = "answer-question";

    const p = document.createElement("p"); // create a widget with question text
    p.id = "answer-question-p";

    p.appendChild(document.createTextNode(obj.question)); // append text node to div

    const inner = document.createElement("div"); // container fo input field and enter button
    inner.id = "answer-question-inner";
    const input = document.createElement("input"); // input field fo answer on question
    input.id = "answer-question-answer";


    const button = document.createElement("button"); // enter button
    button.id = "answer-question-button";

    button
        .addEventListener("click", () => { // checking an answer

            const answer = obj["answer"]; // getting a correct answer on question
            let giving_answer;

            if (input.value.trim().toLowerCase() === answer.trim().toLowerCase()) { // checking
                __teams[__current_team.number].points += Number(obj["grade"]); // incrementing a points of current team

                giving_answer = document.createElement("div"); // create a green div
                giving_answer.id = "answer-correct";

                document.body.appendChild(giving_answer);
            } else {
                giving_answer = document.createElement("div"); // create a red div
                giving_answer.id = "answer-wrong";

                document.body.appendChild(giving_answer);
            }
            setTimeout(() => { // removing green/red div
                if (__questions_amount < __max_questions) {
                    document.body.removeChild(giving_answer);
                    document.body.removeChild(body); // remove a question page and return to page of list of questions
                    document.querySelector("#list").style.display = "block"; // make a list of questions a visible

                    change_team(); // changing a current team
                    load_team(); // load a team name to widget
                }
            }, 3000);

            __questions_amount++;

            if (__questions_amount >= __max_questions) { // if there are no questions left
                setTimeout(() => {
                    const leader_board = document.createElement("div"); // create new page
                    leader_board.id = "leader-board";

                    const leader_leader_board = document.createElement("div"); // create leader board
                    leader_leader_board.id = "leader-leader-board";
                    let string = ""; // create inner text for leader board
                    let __max_pointers = 0; //max points
                    let __winner = __teams[0]; // if we didn`t find a winner that winner is a first team
                    for (const i of __teams) { // finding a player with the greatest points
                        if (i.points > __max_pointers) {
                            __max_pointers = i.points;
                            __winner = i; // team
                        }
                    }
                    string += `Победитель: ${__winner.name},  ${__max_pointers} очков\n\nТаблица участников\n`; // header of leader board

                    let sorted = __teams.sort((a, b) => { // rating of teams (winner -> loser)
                        if (a.points > b.points) { // sorting function
                            return -1
                        }
                        if (a.points < b.points) {
                            return 1
                        }
                        return 0
                    });
                    for (const i of sorted) { // writing a rows of leader board
                        string += `${i.name} :: ${i.points}\n`
                    }
                    leader_leader_board.innerText = string; //set inner text for leader board
                    leader_board.appendChild(leader_leader_board); // append leader board to page
                    const new_game_button = document.createElement("button"); // create a new game button
                    new_game_button.id = "leader-button";
                    new_game_button.addEventListener("click", async () => {
                        __file_json = undefined;
                        __teams = [];
                        __max_questions = 0;
                        __questions_amount = 0;
                        __teams_amount = 0;
                        __current_team = {};
                        __index_team = 0;
                        await page_file(); // new game
                    });
                    new_game_button.innerText = "новая игра";
                    leader_board.appendChild(new_game_button);
                    document.body.appendChild(leader_board); // append leader board
                }, 2000)
            }

        });
    inner.appendChild(input)
    inner.appendChild(button)
    div.appendChild(p);
    div.appendChild(inner);
    body.appendChild(div);

    document.body.appendChild(body); // append an answer widget to page
    requestAnimationFrame(() => {
        input.focus();
    })
    document.querySelector("#list").style.display = "none"; // hiding a list widget
    document.querySelector("#answer").style.position = "absolute"; // make answer widget visible


}


/**
 *
 *
 * @function page_main
 * @description load a main page
 *
 * @returns {Promise<void>}
 *
 *
 */
async function page_main() {
    const {API} = window;
    document.body.innerHTML = await API.load_page("page_quest_list.html");
    await create_cats_widgets(); // load categories
    await change_team(); // set current team
    await load_team(); // load a team name to widget

    // create a list of teams with his points
    const current_team = document.querySelector("#list-current-team");
    current_team.addEventListener("mouseover", () => {
        try {
            current_team.classList.remove("list-current-team-bottom");
        } catch (e) {
            console.log(e)
        }
        current_team.classList.add("list-current-team-top");
        setTimeout(() => {
            const p = document.createElement("p");
            const child = current_team.querySelector("p");
            current_team.removeChild(child);
            let string = "";
            for (const team of __teams) {
                string += `${team["name"]} :: ${team["points"]}\n`;
            }
            p.innerText = string;
            current_team.appendChild(p);
        }, 1000)


    })
    current_team.addEventListener("mouseleave", () => {
        try {
            current_team.classList.remove("list-current-team-top");
        } catch (e) {
            console.log(e)
        }
        current_team.classList.add("list-current-team-bottom");
        setTimeout(() => {
            current_team.removeChild(current_team.querySelector("p"));
            const p = document.createElement("p");
            p.innerText = __current_team.name;
            current_team.appendChild(p);
        }, 1000)
    })

}

/**
 *
 *
 * @function page_teams
 * @description load a page where players can create teams
 *
 * @returns {Promise<void>}
 * @async
 *
 *
 */
async function page_teams() { // function that set a main page as 'page teams'
    const {API} = window; // load API
    document.body.innerHTML = await API.load_page("page_team.html"); // load the page

    document.querySelector("#team-add")
        .addEventListener("click", async () => await add_team()); // addition a new team

    document.querySelector("#team-undo")
        .addEventListener("click", async () => await page_file()); // return to previous page

    document.querySelector("#team-redo")
        .addEventListener("click", async () => {  // crossing to next page

                const teams = document.getElementById("team-teams").children; // get a list of all teams

                if (teams.length < 2) { // if teams were created less than 2
                    alert("Создайте хотя-бы две команды");
                    return -1;
                }

                let __names = []; //var for finding duplicates
                for (const __element of teams) {
                    const input__ = __element.getElementsByClassName("team-team-name")[0]; // we get an input tag from parent by it class name

                    const value__ = input__.value; // we get it value that means a name of team
                    if (__names.includes(value__)) { // if we have a two or more teams with same name
                        alert("Именя команд должны быть разными");
                        return -1;
                    }
                    __names.push(value__); // we push this name to array
                }
                for (const i of __names) { // we create an object that contains all info about all teams
                    __teams.push({
                        name: i,
                        points: 0
                    })
                }
                await page_main() // load new page
            }
        );
    await add_team(); // create two teams
    await add_team();
}


/**
 *
 *
 * @function page_file
 * @description load a page where players can load file with questions
 *
 * @returns {Promise<void>}
 * @async
 *
 *
 */
async function page_file() { // function that set a main page as 'page file'
    const {API} = window; // load API
    document.body.innerHTML = await API.load_page("page_file.html"); // get page and set as main page
    const input = document.querySelector("input"); // get tag input


    input.addEventListener("change", async () => { // if input was changed
        let file = input.files[0];

        const reader = new FileReader();

        reader.readAsText(file);
        reader.onloadend = async (e) => {

            __file_json = JSON.parse(e.target.result); // get text of file
        }
    });

    document.querySelector("#file-continue"). // event on continue button
        addEventListener("click", async () => {
            if (__file_json === undefined) {
                alert("Выберите файл");
                return 0;
            }
            await page_teams();
        });


}

//end region


window.addEventListener("DOMContentLoaded", async () => {

    await page_file();

})