//Author: Devon Letendre
//Web Dev 1 Final Project

//1. Here we create a function that will dynamically create HTML elements when needed. The function takes as input, an HTML
// tag type, some text content, and a class name. The type of HTML element created deopends on the tag type supplied (default is
// a paragraph element). The text content will be added between the HTML tags. Also, if a user has defined a CSS class 
// and wants this HTML element to be affected by it, they can supply that class name as an optional input.
function createElemWithText(htmlTag = "p", textContent = "", className){

    // create the element using the supplied tag name
    const htmlElement = document.createElement(htmlTag);

    // add any text that goes in the HTML element
    htmlElement.textContent = textContent;

    // now, if the element is part of a user defined CSS class, we add that class info to the HTML element
    if (className){
        htmlElement.className = className;
    }
    // we return the created HTML element
    return htmlElement;
}

//2. Here we have a function that receives some JSON user data as a param and creates
// an option element for each user and populates it with the users id and username.
// It returns an array
function createSelectOptions(usersData){

    // if no valid parameter is received, the function returns undefined
    if (!usersData) return;

    // we create an empty array to hold the option elements
    const optionElements = [];

    // we loop through the user data 
    for (const user of usersData){

        // we create an option element for each user
        const optionElement = document.createElement('option');

        // we set the option element value equal to the users id
        optionElement.value = user.id;

        // we set the option element equal to the user name 
        optionElement.textContent = user.name;

        // we push the option element to the optionElements array
        optionElements.push(optionElement);
    };

    // we return the array of option elements where each option element represents a user
    return optionElements;
}

//3. Here we receive a postId, find the corresponding section element, toggle its hide class, and returns the section element with that adjustment
function toggleCommentSection(postId){

    // if postId is not defined or is null, we return undefined
    if (postId === undefined) return;

    // we select the section element where the data-post-id attribute is equal to postId
    const section = document.querySelector(`section[data-post-id="${postId}"]`);

    // we verify the section exists (not undefined) before proceeding. If not defined, we return from this function null
    if (!section?.classList) return null;

    // toggles the class "hide" on the section element show that it shows (if not already) and stops showing (if it is already)
    section.classList.toggle("hide");

    // return the section element
    return section;
}

//4. Here we find the button element of the given postID and toggle it to show or hide comments based on it's current state
function toggleCommentButton(postId){

    // if postId is not defined, we return undefined
    if (postId === undefined) return;

    // we select the button element where the data-post-id attribute is equal to postId
    const button = document.querySelector(`button[data-post-id="${postId}"]`);

    // we verify the button is not null before proceeding.
    if (!button) return null;

    // we set the button text content to hide if it's already showing, and show if it's currently hiding
    button.textContent = button.textContent === "Show Comments" ? "Hide Comments" : "Show Comments";

    // return the button element in it's new state
    return button;
}

//5. Here we remove all child elements of a given parentElement and return the parent element without any children
function deleteChildElements(parentElement){

    // we ensure that the input parameter is an HTML element. if its not, we return undefinded 
    if (!(parentElement instanceof HTMLElement)) return;

    // we define the child as the last child element of the parentElement
    let child = parentElement.lastElementChild;

    // we iterate while there is a valid child element. This stops once child is undefined (we have removed all valid children)
    while(child){
        // remove the current child element
        parentElement.removeChild(child)

        // set the child element equal to the current, new child element
        child = parentElement.lastElementChild;
    }

    return parentElement;
}

//6. Here we add event listeners to all buttons within the main element
// it returns a node list of all buttons with the click event listeners added
function addButtonListeners(){

    const buttons = document.querySelectorAll('main button');

    if (buttons.length > 0){

        for(const button of buttons){
            const postId = button.dataset.postId;

            if (postId){
                button.addEventListener('click', (event) => {
                    toggleComments(event, postId);
                });
            }
        }
    }
    return buttons;
}

//7. Here we remove event listeners to all buttons within the main element
// it returns a node list of all buttons without any click event listeners
function removeButtonListeners() {

    // select all buttons inside the main element
    const buttons = document.querySelectorAll('main button');

    if (buttons.length > 0){
        // loop through the NodeList of buttons
        for(const button of buttons){
            // get the postId from button's dataset
            const postId = button.dataset.postId;

            // if postId exists, remove the click event listener
            if (postId) {
                // use the same function reference as when adding the event listener
                button.removeEventListener('click', toggleComments);
            }
        }
    }

    return buttons;
}

//8. Here we have a function that will parse some JSON data (comments) and create an 
// article element for each. Each article element will have an h3 element, a <p> element for 
// the comment, and a <p> element for the email. the return type is a document fragment
function createComments(comments) {

    // we check if defined and return undefined if not
    if (!comments) return;

    // create the document fragment
    const fragment = document.createDocumentFragment();

    // we loop through the comments
    for(const comment of comments){
        // we create an atricle element for each comment
        const article = document.createElement('article');

        // we create an h3 element for each comment name
        const h3_CommentName = createElemWithText('h3', comment.name);

        // we create a paragraph element for each comment body
        const p_CommentBody = createElemWithText('p', comment.body);

        // we creater a paragraph element for each comment email
        const p_CommentEmail = createElemWithText('p', `From: ${comment.email}`);

        // we append our elements to the article element
        article.appendChild(h3_CommentName);
        article.appendChild(p_CommentBody);
        article.appendChild(p_CommentEmail);

        // we append the article element to the fragment element
        fragment.appendChild(article);
    }
    // we return the fragment element
    return fragment;
}

//9. This function takes JSON user data as an argument and then parses it into array and adds each item to the select menu
function populateSelectMenu(userData) {

    // return undefined if userData is not defined
    if (!userData) return;

    // we get the selectMenu by its element id
    const selectMenu = document.getElementById('selectMenu');

    // we create an array of option elements using our previouslt defined createSelectOptions function
    const options = createSelectOptions(userData);

    // for each element in the options array, we append it to the select menu
    for(const option of options){
    selectMenu.appendChild(option);
    }

    // return the select menu
    return selectMenu;
}

//10. Here we have an asynchrouns function that fetches the users using JSON. It returns the users
async function getUsers() {

    try {
        // we get the users data using JSON
        const res = await fetch("https://jsonplaceholder.typicode.com/users");

        // if response is bad, raise an error
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        // we parse and return the JSON data
        const usersData = await res.json();
        return usersData;

    } catch (err) {
        // if process fails, log the error message
        console.error(err);
    }
}

//11. Here we have an asynchrouns function that fetches the users posts using JSON. It returns the users posts
async function getUserPosts(userId) {

    try {
        // ensure user ID is defined
        if (!userId) throw new Error("An input to this function is required -- user ID");

        // we get the users posts data using JSON
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);

        // if response is bad, raise an error
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        // we parse and return the JSON data
        const postsData = await res.json();
        return postsData;

    } catch (err) {
        // if process fails, log the error message
        console.error(err);
    }
}

//12. Here we have an asynchronous funtion that takes a user id as a parameter and return the JSON data for that user
async function getUser(userId) {

    try {
        // ensure the user ID is defined 
        if (!userId) throw new Error("An input to this function is required -- user ID");

        // we get the JSON data for the particular user
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        // if response is bad, raise an error
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        // we parse and return the JSON data
        const userData = await res.json();
        return userData;

    } catch (err) {
        // if the process fails, log the error message
        console.error(err);
    }
}

//13. Here we have an asynchronous function that takes a post ID and returns all the comments on the post
async function getPostComments(postId) {

    try {
        // ensure the post ID is defined 
        if (!postId) throw new Error("An input to this function is required -- post ID");

        // we get the JSON data for the particular post
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);

        // if response is bad, raise an error
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        // we parse and return the JSON data
        const commentsData = await res.json();
        return commentsData;

    } catch (err) {
        // if the process fails, log the error message
        console.error(err);
    }
}

//14. This function will create a section element which contains all the comments for a given posId
async function displayComments(postId) {

    // ensure the post ID is defined 
    if (!postId) {
        return undefined;
    }

    // we create the section element
    const section = document.createElement('section');

    // we set an attribute on the section element
    section.dataset.postId = postId;

    // add the classes "comments" and "hide" to the sectiion element
    section.classList.add('comments', 'hide');

    // create comments variable that represents the post comments
    const comments = await getPostComments(postId);

    // create fragment variable on the comments variable
    const fragment = createComments(comments);

    // we append the fragment to the section
    section.appendChild(fragment);

    // we return the section element
    return section;
}

//15. This function takes JSON data for some posts and creates some elements for each post
// we return a document fragment containing all the posts
async function createPosts(posts) {

    // ensure the post ID is defined 
    if (!posts) {
        return undefined;
    }

    // Create a document fragment
    const fragment = document.createDocumentFragment();

    // Loop through the posts data
    for (const post of posts) {
        // we create elements for each post and fill their contents
        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        const pBody = document.createElement('p');
        const pPostId = document.createElement('p');
        const button = document.createElement('button');

        h2.textContent = post.title;
        pBody.textContent = post.body;
        pPostId.textContent = `Post ID: ${post.id}`;
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;

        // we get the author details and add that info 
        const author = await getUser(post.userId);
        const pAuthor = document.createElement('p');
        pAuthor.textContent = `Author: ${author.name} with ${author.company.name}`;

        // we get the catch phrase and add that info
        const pCatchPhrase = document.createElement('p');
        pCatchPhrase.textContent = author.company.catchPhrase;

        // we get the comments section for the post id
        const section = await displayComments(post.id);

        // we add all the elements to the article
        article.appendChild(h2);
        article.appendChild(pBody);
        article.appendChild(pPostId);
        article.appendChild(pAuthor);
        article.appendChild(pCatchPhrase);
        article.appendChild(button);
        article.appendChild(section);

        // we append the article to the fragment
        fragment.appendChild(article);
    }

    // we return the fragment element
    return fragment;
}

//16. This function takes posts data, creates either a set of post elements or a 
// default message, and returns the resulting element.
async function displayPosts(posts) {

    const main = document.querySelector('main');

    // if the post exists, we create the elements,
    // otherwise we create a paragraph with default message and class
    const element = posts && posts.length > 0
        ? await createPosts(posts)  
        : createElemWithText('p', 'Select an Employee to display their posts.', 'default-text'); 

    // add the element to the main element
    main.appendChild(element);

    // return the element
    return element;
}

//17. This function takes an event and a postId as input, and returns an array 
//containing the section and button elements related to the postId after toggling their visibility.
function toggleComments(event, postId) {

    // ensure the event and postId are defined 
    if (!event || !postId) {
        return undefined;
    }

   // for testing purposes
    event.target.listener = true;

    // we call our previously defined functions
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    // we return an array containing the section and button elements
    return [section, button];
}

//18. This function takes a list of posts as input, and returns an array containing the results 
// of removing and adding button listeners, clearing child elements, and displaying the posts.
async function refreshPosts(posts) {

    // ensure posts is defined 
    if (!posts) {
        return undefined;
    }

    // we call our previously defined function
    const removeButtons = removeButtonListeners();

    // we get the main element
    const main = document.querySelector('main');

    // we call opur previously defined functions
    const clearedMain = deleteChildElements(main);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();

    // we return an array of the results from the functions called
    return [removeButtons, clearedMain, fragment, addButtons];
}

//19. This function returns an array with the userId, posts data, and results from refreshing the posts.
async function selectMenuChangeEventHandler(event) {
    // ensure event is defined
    if(!event) return undefined;
    
    // we assign the selectMenu from event.target
    const selectMenu = event.target;

    // we ensure event.target exists. if it doesnt, we assign the value 1
    let userId;

    if (selectMenu?.value === 'Employees') {
        userId = 1;
    } else {
        userId = selectMenu?.value || 1;
    }
    
    // disable the selectMenu
    if (selectMenu) {
        selectMenu.disabled = true;
    }

    try {
        // get posts using the userId
        const posts = await getUserPosts(userId);

        // refresh posts
        const refreshPostsArray = await refreshPosts(posts);

        // enable the selectMenu
        if (selectMenu) {
            selectMenu.disabled = false;
        }

        // return the array of results
        return [userId, posts, refreshPostsArray];
    } catch (err) {
        console.error("Error:", err);

        // enable the select meenu if an error occurs
        if (selectMenu) {
            selectMenu.disabled = false;
        }
    }
}


//20. This function gets the users data, populates the select menu, and returns 
//an array with the users data and the select menu element.
async function initPage() {

    try {
        // call await getUsers
        const users = await getUsers();
        
        // pass users data to populateSelectMenu
        const select = populateSelectMenu(users);

        // we return an array with users data and the select element
        return [users, select];
    } catch (err) {
        console.error("Error: ", err);
        return;
    }
}

//21. initializes the page by calling initPage, adds an event listener to the select menu for 
// changes, and handles errors if they occur.
async function initApp() {
    try {
        // we call our previouslty defined function
        const [users, select] = await initPage();

        // we select the menu element by id
        const selectMenu = document.getElementById('selectMenu');

        // we add the  event listener
        selectMenu.addEventListener('change', selectMenuChangeEventHandler);
    } catch (error) {
        console.error("Error initializing the app:", error);
    }
}

//
document.addEventListener('DOMContentLoaded', initApp);
