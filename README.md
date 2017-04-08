# tic_tac_toe
2nd attempt in building the tic-tac-toe project of Free Code Camp after reading and learning about prototypal inheritance

I stopped during my last attempt after failing to implement the MiniMax algorithm for the AI. Partly it was because my structure was so convoluted that I couldn't apply what I learned from the tutorials to my codebase without complete pulling everything apart. I don't regret it eitherway, Kyle Simpon's book was so good I read 4 out of 6 of his You Don't Know Javascript Books and I'll definitely get around to reading the last two as well soon.

But now it's time to put what I've learned to the test. One of my goals during this project is to actively thing about mobile responsiveness in my design as well.
During the last few projects I've been branching away from using Bootstrap as much as I can to learn to manipulate my layout and flex my css muscles.
I hope to get back to using more Bootstrap in this project but also customize the css to my own liking.

I haven't planned this remake attempt yet but I'll probably borrow elements in the design from the last attempt and implement it more with Bootstrap classes this time.

--

So what I did this time was implement the AI first to make sure I'm gonna succeed, since last time it was too difficult to make changes since my whole code base was so cluttered. Unfortunately I did a lot of copy pasting, down to the comments. Originally I typed everything by hand but it was too long and I wasn't changing a lot because of the complexity of the algorithm (though I do understand it)

- Stack Debugging

I did gain a good amount of stack debugging experience which was new to me (although you can probably call putting a lot of console.log statements as stack debugging as well. lol) since I enountered a "Maximum stack size exceeded error" or probably more commonly known as Stackoverflow during the recursion part of the algorithm. Chrome's buil-in dev tools seems really useful for these kind of problems since you can see for each stack not only the name and line number of the function but also the values of the surrounding varibles in that scope so you can study how the values change the functions start running one by one which I admit much cooler and easier than filling my code with console.log. But I still used console.log at the end because I was able to narrow down the areas which I think was causing the problems. My reason for using console.log is because the values are permanently printed unlike with the stack debugger where the stack has to be active/selected to show the values and even then it's not copy pastable.

In the end I found that forgot to include the parameter in when delegating on the functions.

It's because with OO Class style of programming, you only need one line to create the object and inherit the properties from the constructor
Eg. var myObj = new AI(masterLevel);

On the other hand with Prototypal inheritance, you need two lines two create an object then delegate the functionality
Eg. var myObj = Object.create(AI); //creates the object
	myObj.initAI(masterLevel);	//delegates to the AI Object the initAI function

- Prototypal Inheritance

Being able to apply the prototypal inheritance was definitely the biggest victory for me here. I was so happy when I realized that I could implement it and started to understand it more and more.

- Modular

To make it easier to test my code I cloned the github repo of the tutorial I followed and used his files and swapped out the script.js I used.
However his file structure was really modular with ai, game, control and ui all on a different script file.

At first I tried to implement it in seperate files as well but only made the OO code into Prototypal inheritance. Then there was errors and controller couldn't call a function from another file (though I suspect it was because of my implementation; a type or mistake probably) so I combined all the script files except ui.js into one script file and started working on that instead. After I fixed the recursion error, I seperated everything to each of its own script files. The whole stack debuggin process allowed me to understand the code on a deeper level and I think I understand the modularity of the code. It made me more confident as well to try mvc since I think this uses the same concept although with the model.

Definitely although this seemed to be a copy paste project, it opened up a lot of things for me and I will probably try to implement these (prototypal inheritance, seperate script files) more in my future project.

Anyway I still have to create my own AI and customize the AI and Game structure to my own liking so it's not yet done.

--

For the UI I decided to scrap some of the "unecessary" add-ons I added during my last attempt. Some of them would be cool, like having a scoreboard but I'm pressed for time since I wanna complete claim the Front End Certification so I just went to for the bare minimum (well not too bare minimum)

I also remove the sticky note ui I initially added to the project at the end of the project. Since for mobile you have to scroll way down anyway to see the sticky note which just displays the same information that I already display in the main ui (because it would be weird if the user had to scroll way down to see who's turn it is) so I just removed it to make the experience the same for desktop and mobile.

Plus it's a tic-tac-toe game anyway so it makes more sense that people might come to the site on mobile when they're bored rather than when they're on their laptops