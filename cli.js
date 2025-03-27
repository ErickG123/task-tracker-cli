const fs = require("fs");

const filePath = "tasks.json";

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

const args = process.argv.slice(2);
const cmd = args[0];

switch (cmd) {
    case "add":
        functions.addValue(args[1]);
        break;
    case "update":
        updateValue(args[1], args[2]);
        break;
    case "delete":
        deleteValue(args[1]);
        break;
    case "mark-in-progress":
        updateStatus(args[1], 1);
        break;
    case "mark-done":
        updateStatus(args[1], 2);
        break;
    case "list":
        if (args[1] == "todo") {
            listByStatus(0);
        } else if (args[1] == "in-progress") {
            listByStatus(1);
        } else if (args[1] == "done") {
            listByStatus(2);
        } else {
            listAll();
        }
        break;
    default:
        console.log("Opção Inválida.");
        break;
}

function addValue(value) {
    let newTask = {
        "id": Date.now(),
        "description": value,
        "status": 0,
        "createdAt": Date.now(),
        "updatedAt": Date.now()
    }

    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);

    data.push(newTask);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("Tarefa adicionada com sucesso!");
}

function updateValue(id, value) {
    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);

    const taskIndex = data.findIndex(task => task.id == parseInt(id));

    data[taskIndex].description = value;
    data[taskIndex].updatedAt = Date.now();

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`Tarefa com id: ${id} atualizada com Sucesso!`);
}

function deleteValue(id) {
    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);

    const taskIndex = data.findIndex(task => task.id == parseInt(id));

    data.splice(taskIndex, 1);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`Tarefa com id: ${id} excluída com Sucesso!`);
}

function updateStatus(id, status) {
    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);

    const taskIndex = data.findIndex(task => task.id == parseInt(id));

    data[taskIndex].status = status;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("Status atualizado com Sucesso.");
}

function listAll() {
    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);

    console.table(data);
}

function listByStatus(status) {
    let data = fs.readFileSync(filePath, "utf8");
    data = JSON.parse(data);

    const tasks = data.filter(task => task.status == status);

    console.table(tasks);
}
