const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

app.use("/static", express.static("public"));

const TodoTask = require("./models/TodoTask");

const uri = process.env.mongoDB;

// const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .then(() => app.listen(3000, () => {
        console.log('Server started on port 3000');
    }))
    .catch((err) => console.error('Error connecting to MongoDB:', err));


//POST METHOD
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// GET METHOD
app.get("/", async (req, res) => {
    const tasks = await TodoTask.find();
    res.render("todo.ejs", { todoTasks: tasks });
});

//UPDATE
app
    .route("/edit/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        const tasks = await TodoTask.find();
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    })
    .post(async (req, res) => {
        const id = req.params.id;
        await TodoTask.findByIdAndUpdate(id, { content: req.body.content })
            .then(() => res.redirect("/"))
            .catch((err) => res.send(500, err))

    });

//DELETE
app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    await TodoTask.findByIdAndRemove(id)
        .then(() => res.redirect("/"))
        .catch((err) => res.send(500, err))
});

//view engine configuration
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('todo.ejs');
});
